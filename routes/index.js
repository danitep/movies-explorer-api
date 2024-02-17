const express = require('express');
const NotFoundError = require('../errors/not-found-err');

const app = express();

const login = require('./signin');
const createUser = require('./signup');
const auth = require('../middlewares/auth');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', login);
app.use('/signup', createUser);

app.use(auth);

app.use('/users', require('./users'));
app.use('/movies', require('./movies'));

app.all('/:any', () => {
  throw new NotFoundError('Неверный путь');
});

module.exports = app;
