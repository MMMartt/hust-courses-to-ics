import { init } from 'node-hustpass'
import { configs, studentInfo } from './config-loader'
import { toICAL, toJSON } from './json-to-ical'
import Log from './simple-log'

const { fetch, login } = init()

const start = async () => {
  try {
    // login
    Log.log('logging in...', 'node-hustpass')
    const ticket = await login({ ...studentInfo, ...configs.login })
    if (/ST-.*?-cas/.test(ticket)) {
      Log.log('successfully login!', 'node-hustpass')
    }
    // fetch lessons
    let { url, options } = configs.lessons
    options = options(studentInfo.period)
    const resp = await fetch(url, options)
    Log.log(options.headers, 'req')
    Log.response(resp)
    // convert to .ical
    const body = await resp.text()
    toICAL(body, studentInfo.alarm)
  } catch (e) {
    Log.error(e)
    Log.error(
      '请多尝试几次。如果还是不行则检查密码，如确定密码无误请发送 issue。'
    )
  }
}

start()
