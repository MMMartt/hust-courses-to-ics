// [jsdoc do not support curried function yet](https://github.com/jsdoc3/jsdoc/issues/1286)
/**
 * @typedef {function} GenForm
 * @param {Object} form - form to be filled in
 * @returns {{body: *}} - request configuration
 */
/**
 * return curried function
 * @param {Object} configure - without form field
 * @returns {GenForm} - curried function, receive form
 */
const genForm = configure => form =>
  form ? { ...configure, body: new URLSearchParams(form) } : configure

module.exports = {
  login: {
    url:
      'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action',
  },
  lessons: {
    url: 'http://hubs.hust.edu.cn/aam/score/CourseInquiry_ido.action',
    options: genForm({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3835.0 Safari/537.36',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,en-US;q=0.7,en;q=0.3',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
      },
      method: 'POST',
      referrer: 'http://hubs.hust.edu.cn/aam/report/scheduleQuery.jsp',
    }),
  },
}
