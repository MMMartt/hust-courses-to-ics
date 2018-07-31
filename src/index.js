import rq from 'request-promise-native'
import { configs, studentInfo } from './config-loader'
import { toICAL, toJSON } from './json-to-ical'
import RSA from './rsa-loader'
import Log from './simple-log'

const regex = {
  publicKey: /RSAKeyPair\("([0-9]*?)","","([0-9a-fA-F]*?)"\);/g,
  formInputs: /name="execution" value="([es1-4]*?)"/,
}

const defaultOption = {
  jar: true,
  simple: false,
  resolveWithFullResponse: true,
}

const request = rq.defaults(defaultOption)

// pre works, get init cookie
request(configs.preWork())
  .then(res => {
    Log.response(res)
    const genForm = data => {
      const publicKey = regex.publicKey.exec(data)
      if (!publicKey || publicKey.length < 2) {
        throw new Error(`No public key found in pre sites: ${configs.preWork()['url']}`)
      }
      const [username, password] = [studentInfo.username, studentInfo.password].map(
        string => RSA.encryptedString(
          RSA.RSAKeyPair(publicKey[1], publicKey[2]),
          string
        )
      )
      return {
        username,
        password,
        code: 'code',
        lt: 'LT-NeusoftAlwaysValidTicket',
        execution: 'e1s1',
        _eventId: 'submit',
      }
    }
    return request(
      configs.login(
        genForm(res.body)
      )
    )
  })
  .then(res => {
    Log.response(res)
    return request(configs.hub())
  })
  .then(res => {
    Log.response(res)
    return request(configs.lessons(studentInfo.period))
  })
  .then(res => {
    Log.response(res)
    toICAL(res.body, studentInfo.alarm)
  })
  .catch(err => {
    Log.error(err)
    Log.error('请多尝试几次。如果还是不行则检查密码，如确定密码无误请发送 issue。')
  })
