const response = (r) => {
  console.log('==== req ====>\n', r.request.headers, '\n==== req ====>');
  console.log('==== status ====\n', r.statusCode, '\n==== status ====');
  console.log('<==== res ====\n', r.headers);
};
const error = (e) => console.log('error', e);
const either = (e, r) => {
  if (e) {
    error(e);
    return false;
  }
  response(r);
  return true;
};
const Log = {
  response,
  error,
  either
};
export default Log;
