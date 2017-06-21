import fs from 'fs';

const read = (f) => {
  return fs.readFileSync(f).toString();
};
const include = (f) =>  {
  eval.apply(global, [read(f)]);
};

include('../lib/BigInt.js');
include('../lib/Barrett.js');
include('../lib/RSA.js');

const RSA = {
  RSAKeyPair: (e, n) => {
    setMaxDigits(130);
    return new RSAKeyPair(e, '', n);
  },
  encryptedString: (key, string) => encryptedString(key, string)
};
export default RSA;
