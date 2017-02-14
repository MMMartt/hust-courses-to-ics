var fs = require("fs");

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}
include('./BigInt.js');
include('./Barrett.js');
include('./RSA.js');

setMaxDigits(130);

const studentInfo = require('./student-info.json')

console.log(studentInfo);

var request = require('request');

const hubpassJspUrl = 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fone.hust.edu.cn%2Fdcp%2Findex.jsp'
const loginUrl = 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhub.hust.edu.cn%2Fhustpass.action'

let publicKey = {n:'', e:'', key: null};

const regex = /RSAKeyPair\(\"([0-9]*?)\",\"\",\"([0-9a-fA-F]*?)\"\);/g
const regex2 = /name=\"execution\" value=\"([es1-4]*?)\"/

const basicHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Referer': 'pass.hust.edu.cn',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
}
const hubHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Host': 'hubs.hust.edu.cn',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
}
let loginHeaders = {
  url: loginUrl,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Length': '603',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'pass.hust.edu.cn',
    'Origin': 'https://pass.hust.edu.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  },
  form: {
    'username':'',
    'password':'',
    'code':'code',
    'lt':'LT-NeusoftAlwaysValidTicket',
    'execution':'e1s1',
    '_eventId':'submit'
  }
};

var request = request.defaults({jar: true});
//request(getPubkey, callback);
request.get({url: hubpassJspUrl, headers: basicHeaders}, (error, response, body) => {
  if (!error) {
    console.log(response['request']['headers'])
    console.log(response['headers']);
    console.log(response['statusCode']);
    const reResult = regex.exec(body);
    publicKey.e = reResult[1];
    publicKey.n = reResult[2];
    publicKey.key = new RSAKeyPair(publicKey.e, '', publicKey.n);
    loginHeaders.form.username = encryptedString(publicKey.key, studentInfo.username);
    loginHeaders.form.password = encryptedString(publicKey.key, studentInfo.password);

  }
  request.post(loginHeaders, (error, response, body) => {
    if (!error) {
      console.log(response['request']['headers'])
      console.log(response['headers']);
      console.log(response['statusCode']);
      if (response['statusCode'] === 302) {
        request.get({url: 'http://hubs.hust.edu.cn/hustpass.action', headers: hubHeaders}, (error, response, body) => {
          if (!error) {
            console.log(response['request']['headers'])
            console.log(response['headers']);
            console.log(response['statusCode']);
            request.post({url: 'http://hubs.hust.edu.cn/aam/score/CourseInquiry_ido.action',
              headers: hubHeaders,
              form: {
                'start': '2017-01-01',
                'end': '2017-08-01'
              }
            }, (error, response, body) => {
              if (!error) {
                console.log(response['request']['headers'])
                console.log(response['headers']);
                console.log(response['statusCode']);
                console.log(body);
              }
            })
          } else {
            console.log(error);
          }
        });
      }
    }
  });
});
