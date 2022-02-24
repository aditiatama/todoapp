const TodosController = require('../controllers/todos-controller');
const authorizationMiddleware = require('../middlewares/authorization-middleware');
const router = require('express').Router();

// GET /todos
router.get('/', TodosController.findAll);

// GET /todos/:id
router.get('/:id', TodosController.findById);

// POST /todos
router.post('/', TodosController.insert);

// DELETE /todos/:id
router.delete('/:id', authorizationMiddleware, TodosController.delete);

// PUT /todos/:id
router.put('/:id', TodosController.update);

module.exports = router;
