import rq from 'request-promise-native'
import { configs, studentInfo } from './config-loader'
import { toICAL, toJSON } from './json-to-ical'
import RSA from './rsa-loader'
import Log from './simple-log'

const regexs = {
  pubkey: /RSAKeyPair\("([0-9]*?)","","([0-9a-fA-F]*?)"\);/g,
  formInputs: /name="execution" value="([es1-4]*?)"/,
}

const defaultOption = {
  jar: true,
  simple: false,
  resolveWithFullResponse: true,
}

const request = rq.defaults(defaultOption)

request({
  url: configs.firstHeaders.url,
  headers: configs.firstHeaders.headers,
  method: 'GET',
}).then((res) => {
  Log.response(res)
  const parseData = (data) => {
    const pubkeyString = regexs.pubkey.exec(data)
    if (pubkeyString === null) {
      Log.error('no pubkey found!')
      return null
    }
    const pubkey = RSA.RSAKeyPair(pubkeyString[1], pubkeyString[2])
    const encrypt = string => RSA.encryptedString(pubkey, string)
    return {
      username: encrypt(studentInfo.username),
      password: encrypt(studentInfo.password),
      code: 'code',
      lt: 'LT-NeusoftAlwaysValidTicket',
      execution: 'e1s1',
      _eventId: 'submit',
    }
  }
  const userInfo = parseData(res.body)
  if (!userInfo) {
    throw new Error('Whoops! Something\'s wrong while parsing for pubkey.')
  }
  return request({
    url: configs.loginHeaders.url,
    headers: configs.loginHeaders.headers,
    method: 'POST',
    form: userInfo,
  })
}).then((res) => {
  Log.response(res)
  return request({
    url: configs.hubHeaders.url,
    headers: configs.hubHeaders.headers,
    method: 'GET',
  })
}).then((res) => {
  Log.response(res)
  return request({
    url: configs.lessonsHeaders.url,
    headers: configs.lessonsHeaders.headers,
    form: studentInfo.period,
    method: 'POST',
  })
}).then((res) => {
  Log.response(res)
  toICAL(res.body)
}).catch((err) => {
  Log.error(err)
  console.log('emmm, 出了问题多半是密码错了, 如果不是, 请发 issue')
})
