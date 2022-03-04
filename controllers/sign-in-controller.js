const { compare } = require('../helpers/hash-helper');
const { sign } = require('../helpers/jwt-helper');
const { User } = require('./../models/index');

class SignInController {
  static async signIn(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password) throw { name: 'BadRequest' };
      const result = await User.findOne({ where: { email } });
      if (!result) throw { name: 'SignInFailed' };
      if (!compare(password, result.password)) throw { name: 'SignInFailed' };
      const access_token = sign({ id: result.id, email: result.email });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SignInController;
