class CustomRNG {

  constructor() {}

  randomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>/~';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let buff = new Buffer.from(result);
    result = buff.toString('base64');
    return result;
  }
}

module.exports = CustomRNG;
