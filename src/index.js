var request = require('request');
const log = require('./simple-log.js');
const rsa = require('./rsa-loader.js');
const configs = require('./config-loader.js');
const jsonToIcal = require('./json-to-ical.js');

const pubkeyRegex = /RSAKeyPair\(\"([0-9]*?)\",\"\",\"([0-9a-fA-F]*?)\"\);/g;
const formInputRegex = /name=\"execution\" value=\"([es1-4]*?)\"/;

var request = request.defaults({jar: true});

request.get(configs.firstHeaders, (err, res, body) => {
  if (!log.either(err, res)) {
    return;
  }
  let infoForm = {};
  const pubkeyRes = pubkeyRegex.exec(body);
  if (pubkeyRes == null) {
    log.error('no pubkey found!');
    return;
  }
  const pubkey = rsa.RSAKeyPair(pubkeyRes[1], pubkeyRes[2]);
  infoForm['username'] = rsa.encryptedString(pubkey, configs.studentInfo.username);
  infoForm['password'] = rsa.encryptedString(pubkey, configs.studentInfo.password);
  //console.log(configs.loginHeaders);
  //TODO: get these value from html rather than copy from it.
  configs.loginHeaders['form'] = {};
  configs.loginHeaders['form']['username'] = infoForm['username'];
  configs.loginHeaders['form']['password'] = infoForm['password'];
  configs.loginHeaders['form']['code'] = 'code';
  configs.loginHeaders['form']['lt'] = 'LT-NeusoftAlwaysValidTicket';
  configs.loginHeaders['form']['execution'] = 'e1s1';
  configs.loginHeaders['form']['_eventId'] = 'submit';
  //console.log(configs.loginHeaders['form'])
  request.post(configs.loginHeaders, (err, res, body) => {
    if (!log.either(err, res)) {
      return;
    }
    request.get(configs.hubHeaders, (err, res, body) => {
      if (!log.either(err, res)) {
        return;
      }
      request.post(configs.lessonsHeaders, (err, res, body) => {
        if (!log.either(err, res)) {
          return;
        }
        jsonToIcal.exportToICAL(body);
        //jsonToIcal.exportToJSON(body);
        //console.log(JSON.parse(body));
      });
    });
  });
});
