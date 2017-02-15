module.exports = {
  response: (r) => {
    console.log('==== req ====>\n', r['request']['headers'], '\n==== req ====>');
    console.log('Status Code:', r['statusCode']);
    console.log('<==== res ====\n', r['headers']);
  },
  error: (e) => {
    console.error('error', e);
  },
  either: (e, r) => {
    if (e) {
      console.error(e);
      return false;
    }
    console.log('==== req ====>\n', r['request']['headers'], '\n==== req ====>');
    console.log('==== status ====\n', r['statusCode'], '\n==== status ====');
    console.log('<==== res ====\n', r['headers'], '\n<==== res ====');
    return true;
  }
};
