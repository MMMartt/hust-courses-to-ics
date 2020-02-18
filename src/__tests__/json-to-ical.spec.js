import assert from 'assert'
// we don't test ical.js
import { deduplicate, parseToICal } from '../json-to-ical'
import chai from 'chai'
import jsIcal from 'ical.js'
// raw data looks like Array of:
// {
//   "start":"2017-02-13 15:55",
//   "end":"2017-02-13 17:30",
//   "title":"微积分（一）（下）",
//   "txt":"{'KCMC':'微积分（一）（下）','JSMC':'东九楼B201','JGXM':'周军','KTMC':'软件1605-06，数媒1601'}" ,
//   "allDay":false
// }
describe('to ICal', () => {
  const courseA = {
    'start': '2017-02-13 15:55',
    'end': '2017-02-13 17:30',
    'title': '微积分（一）（下）',
    'txt': '{\'KCMC\':\'微积分（一）（下）\',\'JSMC\':\'东九楼B201\',\'JGXM\':\'周军\',\'KTMC\':\'软件1605-06，数媒1601\'}',
    'allDay': false
  }
  const courseB = {
    ...courseA,
    'start': '2017-02-11 12:55',
    'end': '2017-02-11 13:30'
  }
  const configurationA = {
    alarm: false,
    triggerTime: 30,
    duration: 5,
    repeat: 2
  }
  it('should parse to ICal', () => {
    const jCalA = new jsIcal.Component(jsIcal.parse(parseToICal([courseA], configurationA)))
    const jCalB = new jsIcal.Component(jsIcal.parse(parseToICal([courseA, courseB, courseA], configurationA)))
    chai.expect(jCalA.getAllSubcomponents()).to.have.lengthOf(1)
    chai.expect(jCalB.getAllSubcomponents()).to.have.lengthOf(3)
  })
  it('should set properties correctly', () => {
    const jCalA = new jsIcal.Component(jsIcal.parse(parseToICal([courseA], configurationA)))
    const vevent = jCalA.getFirstSubcomponent()
    const event = new jsIcal.Event(vevent)
    chai.expect(event.location).to.be.eql('东九楼B201')
  })
  it('should work with deduplicate part', () => {
    const jCalA = new jsIcal.Component(
      jsIcal.parse(parseToICal(deduplicate([courseA, courseB, courseA]), configurationA))
    )
    chai.expect(jCalA.getAllSubcomponents()).to.have.lengthOf(2)
  })
  it('should work with alarm', () => {
    const jCalA = new jsIcal.Component(
      jsIcal.parse(parseToICal(deduplicate([courseA, courseB, courseA]), {
        ...configurationA,
        alarm: true
      }))
    )
    chai.expect(jCalA.getAllSubcomponents()[1].getAllSubcomponents()[0].jCal[1]).to.have.lengthOf(4)
  })
  it('should set default alarm property', () => {
    const jCalA = new jsIcal.Component(
      jsIcal.parse(parseToICal(deduplicate([courseA, courseB, courseA]), {
        alarm: true
      }))
    )
    chai.expect(jCalA.getAllSubcomponents()[1].getAllSubcomponents()[0].jCal[1]).to.have.lengthOf(4)
  })
  it('should work with custom alarm configure', () => {
    const jCalA = new jsIcal.Component(
      jsIcal.parse(parseToICal(deduplicate([courseA, courseB, courseA]), {
        alarm: true,
        duration: 23
      }))
    )
    chai.expect(jCalA.getAllSubcomponents()[1].getAllSubcomponents()[0].jCal[1][1][3]).to.be.valueOf('PT23M')
  })
  it('should workout alarm configure', () => {
    const jCalA = new jsIcal.Component(
      jsIcal.parse(parseToICal(deduplicate([courseA, courseB, courseA])))
    )
    chai.expect(jCalA.getAllSubcomponents()[1].getAllSubcomponents()).to.have.lengthOf(0)
  })
})
describe('deduplicate', () => {
  it('should remove duplication', () => {
    assert.deepEqual(deduplicate(['fff', 'fff', 'fff']), ['fff'])
  })
  it('should NOT parse json inside', () => {
    assert.deepEqual(deduplicate(['{"fff": "ff"}']), ['{"fff": "ff"}'])
  })
  // TODO: 等有空再改
  // it('should parse object correctly', () => {
  //   assert.deepEqual(deduplicate([
  //     {
  //       foo: 'bbb',
  //       bar: 'fff',
  //     },
  //     {
  //       foo: 'bbb',
  //       bar: 'fff',
  //     },
  //     {
  //       foo: 'bab',
  //       bar: 'fff',
  //     },
  //   ]), [
  //     {
  //       foo: 'bbb',
  //       bar: 'fff',
  //     },
  //     {
  //       foo: 'bab',
  //       bar: 'fff',
  //     },
  //   ])
  // })
  // it('should preserve first appearance location', () => {
  //   assert.deepEqual(deduplicate([1, 2, 2, 3, 1]), [1, 2, 3])
  // })
})
