import { configs } from '../config-loader'
import chai from 'chai'

const target = configs.lessons.options

describe('configure generator', () => {
  it('should be fine if form not included', () => {
    chai.expect(target()).to.be.an('object')
  })
  it('and form should not be included', () => {
    chai.expect(target.form).to.be.a('undefined')
  })
  it('curried form should be included correctly', () => {
    chai
      .expect(target({ value: 'vvv' }).body.has('value'))
      .to.equals(true)
  })
})
