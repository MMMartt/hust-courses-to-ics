var fs = require("fs");

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}

include('../lib/BigInt.js');
include('../lib/Barrett.js');
include('../lib/RSA.js');
module.exports = {
  RSAKeyPair: (e, n) => {
    setMaxDigits(130);
    return new RSAKeyPair(e, '', n);
  },
  encryptedString: (key, string) => encryptedString(key, string)
};
