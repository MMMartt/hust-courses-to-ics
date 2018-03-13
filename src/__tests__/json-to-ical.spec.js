import assert from 'assert'
import { toICAL, toJSON } from '../json-to-ical'
// raw data looks like Array of:
// {
//   "start":"2017-02-13 15:55",
//   "end":"2017-02-13 17:30",
//   "title":"微积分（一）（下）",
//   "txt":"{'KCMC':'微积分（一）（下）','JSMC':'东九楼B201','JGXM':'周军','KTMC':'软件1605-06，数媒1601'}" ,
//   "allDay":false
// }
describe('to iCal', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
