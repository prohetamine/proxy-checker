const createHash = () =>
  parseInt(Math.random() * 9999) + '-' +
  parseInt(Math.random() * 9999) + '-' +
  parseInt(Math.random() * 9999) + '-' +
  parseInt(Math.random() * 9999)

module.exports = createHash
