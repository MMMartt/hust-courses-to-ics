let configs = require('./configs.json');
const studentInfo = require('./student-info.json')

function checkConfig() {
  //TODO: check if configuration is valid
  //
}
checkConfig();

module.exports = {
  firstHeaders: configs.firstRequestHeaders,
  loginHeaders: configs.loginHeaders,
  hubHeaders: configs.hubHeaders,
  lessonsHeaders: configs.lessonsHeaders,
  studentInfo: studentInfo
};
