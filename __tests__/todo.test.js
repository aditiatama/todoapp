const request = require('supertest');
const app = require('../app');
const { hash } = require('../helpers/hash-helper');
const { sign } = require('../helpers/jwt-helper');
const { queryInterface } = require('../models/index').sequelize;

const users = [
  {
    username: 'adi',
    email: 'adi@mail.com',
    password: hash('password'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const dateNow = new Date()
const nextweek = new Date(
  dateNow.getFullYear(),
  dateNow.getMonth(),
  dateNow.getDate() + 7,
);

const todos = [
  {
    title: 'Node Js Training',
    description: 'Node Js Training with Hacktiv8',
    UserId: 1,
    due_date: nextweek,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'React Js Training',
    description: 'Node Js Training with Hactiv8',
    UserId: 1,
    due_date: nextweek,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const newTodo = {
  title: 'New Training',
  description: 'New Training with Hactiv8',
  UserId: 1,
  due_date: nextweek,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const access_token = {
  token: '',
};

beforeAll((done) => {
  queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  })
    .then(() => {
      return queryInterface.bulkInsert('Users', users);
    })
    .then(() => {
      access_token.token = sign({ id: 1, email: users[0].email });
      done();
    })
    .catch((error) => {
      done(error);
    });

  queryInterface.bulkDelete('Todos', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    })
      .then(() => {
        return queryInterface.bulkInsert('Todos', todos);
      })
      .then(() => {
        done();
      })
      .catch((error) => {
        done(error);
      });
});

describe('GetAllTodos tests', () => {
  test('successful get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('access_token', access_token.token)
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(todos.length)
        expect(body).toEqual(expect.arrayContaining(
          [
            expect.objectContaining({
              title: todos[0].title,
              description: todos[0].description,
              UserId: todos[0].UserId,
            })
          ]
        ))
        expect(body).toEqual(expect.arrayContaining(
          [
            expect.objectContaining({
              title: todos[1].title,
              description: todos[1].description,
              UserId: todos[1].UserId,
            })
          ]
        ))
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(401)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'no access_token provided' })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe('GetOneTodoByID tests', () => {
  test('successful get one todo', (done) => {
    request(app)
      .get('/todos/1')
      .set('access_token', access_token.token)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            title: todos[0].title,
            description: todos[0].description,
            UserId: todos[0].UserId,
          })
        )
        expect(body.User).toEqual(
          expect.objectContaining({
            username: users[0].username,
            email: users[0].email,
          })
        )
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful get one todo', (done) => {
    request(app)
      .get('/todos')
      .expect(401)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'no access_token provided' })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful get one todo - not found', (done) => {
    request(app)
      .get('/todos/999')
      .set('access_token', access_token.token)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'not found' })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});

describe('CreateTodo tests', () => {
  test('successful create a todo', (done) => {
    request(app)
      .post('/todos')
      .set('access_token', access_token.token)
      .send(newTodo)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(
          expect.objectContaining({
            title: newTodo.title,
            description: newTodo.description,
            UserId: newTodo.UserId,
          })
        )
        expect(body.UserId).toBe(1)
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  
  test('unsuccessful create a todo', (done) => {
    request(app)
      .post('/todos')
      .expect(401)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'no access_token provided' })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful create a todo with empty title', (done) => {
    request(app)
      .post('/todos')
      .set('access_token', access_token.token)
      .send({
        ...newTodo,
        title: ""
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Title can't be empty" })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful create a todo with empty description', (done) => {
    request(app)
      .post('/todos')
      .set('access_token', access_token.token)
      .send({
        ...newTodo,
        description: ""
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Description can't be empty" })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  test('unsuccessful create a todo with empty due_date', (done) => {
    request(app)
      .post('/todos')
      .set('access_token', access_token.token)
      .send({
        ...newTodo,
        due_date: ""
      })
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Due date can't be empty" })
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});