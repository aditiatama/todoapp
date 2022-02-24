const jwt = require('jsonwebtoken');

const sign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const verify = (payload) => {
  return jwt.verify(payload, process.env.JWT_SECRET);
}

module.exports = {
  sign,
  verify
};
