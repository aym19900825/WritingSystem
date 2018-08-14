import CryptoJS from 'crypto-js/crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("keyskeyskeyskeys");
const IV = CryptoJS.enc.Utf8.parse('1234567890123456');
/**
 * AES加密 ：字符串 key iv  返回base64 
 */
function Encrypt(word, keyStr, ivStr) {
  let key = KEY
  let iv = IV
  
  if (keyStr) {
    key = CryptoJS.enc.Latin1.parse(keyStr);
    iv = CryptoJS.enc.Latin1.parse(ivStr);
  }

  // let srcs = CryptoJS.enc.Latin1.parse(word);
  var encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export default Encrypt