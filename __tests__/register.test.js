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

const newUser = {
  username: 'newUser',
  email: 'newUser@mail.com',
  password: hash('password'),
  createdAt: new Date(),
  updatedAt: new Date()
};

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
      console.log(error)
      done(error);
    });
});

describe('register tests', () => {
  test('successful registration', (done) => {
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          id: expect.any(Number),
          username: newUser.username,
          email: newUser.email
        });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test('unsuccessful registration because of empty string as username', (done) => {
    const customUser = {
      ...newUser,
      username: '',
    };
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Username can't be empty" });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test('unsuccessful registration because of username is null', (done) => {
    const customUser = {
      ...newUser,
    };
    delete customUser.username
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: "Username can't be empty" });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test('unsuccessful registration because of email already exists', (done) => {
    const customUser = {
      ...newUser,
      email: 'adi@mail.com',
    };
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'email must be unique' });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test('unsuccessful registration because of wrong email format', (done) => {
    const customUser = {
      ...newUser,
      email: 'user6mailcom',
    };
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'Wrong email format' });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
  test('unsuccessful registration because of password is less than 8 characters', (done) => {
    const customUser = {
      ...newUser,
      password: 'pass',
    };
    request(app)
      .post('/register')
      // .set('access_token', access_token.token)
      .send(customUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ message: 'Password cannot be less than eight characters' });
        done();
      })
      .catch((error) => {
        done(error);
      });
  });
});