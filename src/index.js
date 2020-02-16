import rq from 'request-promise-native'
import { configs, studentInfo } from './config-loader'
import { toICAL, toJSON } from './json-to-ical'
import Log from './simple-log'
import { des } from '../lib/des'

const regex = {
  formInputs: /name="execution" value="([es1-4]*?)"/,
  jsessionid: /(?<=JSESSIONID=).*?(?=;)/,
  lt:/LT-.*?-cas/
}

const jar = rq.jar()
const defaultOption = {
  jar,
  simple: false,
  resolveWithFullResponse: true,
}

const request = rq.defaults(defaultOption)

// pre works, get init cookie
request(configs.preWork())
  .then(res => {
    Log.response(res)
    const jsessionid = jar.getCookieString("https://pass.hust.edu.cn/").match(regex.jsessionid)[0]
    const genForm = data => {
      const [username, password] = [studentInfo.username, studentInfo.password]
      const lt = data.match(regex.lt)[0]
      return {
        ul: username.length,
        pl: password.length,
        lt,
        rsa: des(username+password+lt,'1','2','3'),
        execution: 'e1s1',
        _eventId: 'submit',
      }
    }
    return request(
      configs.login(jsessionid)(
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