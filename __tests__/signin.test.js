const request = require('supertest');
const app = require('../app');
const { hash } = require('../helpers/hash-helper');
const { verify } = require('../helpers/jwt-helper');
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

beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = users.map((element) => {
    const hashedElement = { ...element };
    hashedElement.password = hash(hashedElement.password);
    return hashedElement;
  });
  await queryInterface.bulkInsert('Users', hashedUser);
});

describe('sign in tests', () => {
  test('successful sign in', async () => {
    const { email, password } = users[0];
    const { body } = await request(app)
      .post('/sign-in')
      .send({ email, password })
      .expect(200);
    expect(body).toEqual({ access_token: expect.any(String) });
    const payload = verify(body.access_token);
    expect(payload).toEqual(expect.objectContaining({ id: 1, email: users[0].email }));
  });
  test('unsuccessful sign in because of wrong email', async () => {
    const { body } = await request(app)
      .post('/sign-in')
      .send({ email: 'random@mail.com', password: 'password' })
      .expect(401);
    expect(body).toEqual({ message: 'wrong email/password' });
  });
  test('unsuccessful sign in because of wrong password', async () => {
    const { email } = users[0];
    const { body } = await request(app)
      .post('/sign-in')
      .send({ email, password: 'pass' })
      .expect(401);
    expect(body).toEqual({ message: 'wrong email/password' });
  });
  test('unsuccessful sign in because of email is null', async () => {
    const { password } = users[0];
    const { body } = await request(app)
      .post('/sign-in')
      .send({ password })
      .expect(400);
    expect(body).toEqual({ message: 'bad request' });
  });
  test('unsuccessful sign in because of password is null', async () => {
    const { email } = users[0];
    const { body } = await request(app)
      .post('/sign-in')
      .send({ email })
      .expect(400);
    expect(body).toEqual({ message: 'bad request' });
  });
});