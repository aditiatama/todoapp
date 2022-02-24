const { verify } = require('../helpers/jwt-helper');
const { User } = require('../models/index');

const authenticationMiddleware = async (req, res, next) => {
  // 1. Cek if access_token provided, if not throw error
  // 2. Verify the token, if failed error will be thrown
  // 3. Check if user exists, if not throw error
  // 4. Attach user object to the request, so it can be used by other processes later
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: "TokenNotFound" };
    const { id, email } = verify(access_token)
    const user = await User.findOne({ where: { id: id } });
    if (!user) throw { name: 'Unauthenticated'}
    req.user = {
      id: user.id,
      email: user.email
    }
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authenticationMiddleware;
