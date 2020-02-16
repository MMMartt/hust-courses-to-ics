// [jsdoc do not support curried function yet](https://github.com/jsdoc3/jsdoc/issues/1286)
/**
 * @typedef {function} GenForm
 * @param {Object} form - form to be filled in
 * @returns {{form: *}} - request configuration
 */
/**
 * return curried function
 * @param {Object} configure - without form field
 * @returns {GenForm} - curried function, receive form
 */
const genForm = configure => form => (
  form
    ? {...configure, form}
    : configure
)
module.exports = {
  preWork: genForm({
    url: 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fone.hust.edu.cn%2Fdcp%2Findex.jsp',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Referer': 'pass.hust.edu.cn',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    },
    method: 'GET'
  }),
  login: jsessionid => genForm({
      url: "https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action",
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        // 'Content-Length': '603',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'pass.hust.edu.cn',
        'Origin': 'https://pass.hust.edu.cn',
        'Pragma': 'no-cache',
        // 'Referer': 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action',
        'Referer': `https://pass.hust.edu.cn/cas/login;jsessionid=${jsessionid}?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action`,
        /**
         * Referer here changes to `https://pass.hust.edu.cn/cas/login;jsessionid=${jsessionid}?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action` and jsessionid can be read from a cookieJar.
         * However, the site won't validate referer so you can simply not to pass it 
         */
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
      },
      method: 'POST',
      followRedirect: false,
  }),
  hub: genForm({
    url: 'http://hubs.hust.edu.cn/hustpass.action',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Host': 'hubs.hust.edu.cn',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    },
    method: 'GET'
  }),
  lessons: genForm({
    'url': 'http://hubs.hust.edu.cn/aam/score/CourseInquiry_ido.action',
    'headers': {
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Host': 'hubs.hust.edu.cn',
      'Referer': 'http://hubs.hust.edu.cn/aam/report/scheduleQuery.jsp',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    },
    method: 'POST'
  })
}
