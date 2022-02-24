const bcrypt = require('bcryptjs');

const hash = (input) => {
  return bcrypt.hashSync(input, 10);
}

const compare = (input, hashedInput) => {
  return bcrypt.compareSync(input, hashedInput);
}

module.exports = {
  hash,
  compare
};
