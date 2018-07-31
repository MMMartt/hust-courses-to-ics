// 请多尝试几次，请求可能会出错
module.exports = {
  username: 'U201512345',
  // 统一身份认证平台密码
  password: 'my_password',
  period: {
    start: '2018-01-01',
    end: '2018-08-01'
  },
  // 日历的提醒设置，默认设置与此处配置相同
  alarm: {
    alarm: false,
    // 提前提醒的时长，30即为30分钟
    triggerTime: 30,
    duration: 5,
    repeat: 2
  }
}
