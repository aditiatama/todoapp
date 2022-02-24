const { Todo } = require('../models/index');

const authorizationMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id)
    if (!todo) throw { name: 'NotFound' };
    if (todo.UserId != req.user.id) throw { name: "Unauthorized" };
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authorizationMiddleware;
