const { Todo, User } = require('../models/index');

class TodosController {
  static async findAll(req, res, next) {
    try {
      const todos = await Todo.findAll();
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    const { id } = req.params;
    try {
      const todo = await Todo.findByPk(id, {
        include: {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }
      });
      if (!todo) throw { name: 'NotFound' };
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async insert(req, res, next) {
    // Since we can get user data from req.user, client don't have to incluce UserId in their request
    const { title, description, due_date } = req.body;
    try {
      const result = await Todo.create({ title, description, due_date, UserId: req.user.id });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const result = await Todo.destroy({ where: { id } });
      if (!result) throw { name: 'NotFound' };
      res.status(200).json({ message: 'Todo has been successfully deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { title, description, due_date } = req.body;
    try {
      const result = await Todo.update({ title, description, due_date }, { where: { id }, returning: true });
      if (!result[0]) throw { name: 'NotFound' };
      res.status(200).json(result[1][0]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TodosController;
