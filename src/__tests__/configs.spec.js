import { configs } from '../config-loader'
import chai from 'chai'

describe('configure generator', () => {
  it('should be fine if form not included', () => {
    chai.expect(configs.login()).to.be.an('object')
  })
  it('and form should not be included', () => {
    chai.expect(configs.login().form).to.be.a('undefined')
  })
  it('curried form should be included correctly', () => {
    chai.expect(configs.login({value: 'vvv'}).form).to.haveOwnProperty('value')
  })
})
