const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  STATUS_CONFLICT,
  STATUS_SERVER_ERROR,
} = process.env;

const auth = require('./middlewares/auth');

const app = express();

const allowedCors = {
  origin: [
    'https://danitep15front.nomoredomainsmonster.ru',
    'http://danitep15front.nomoredomainsmonster.ru',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
};

app.use(cors(allowedCors));
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);

const login = require('./routes/signin');
const createUser = require('./routes/signup');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/signin', login);
app.use('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.all('/:any', () => {
  throw new NotFoundError('Неверный путь');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (err.code === 11000) {
    res.status(STATUS_CONFLICT).send({ message: err.message });
  } else if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  next();
});

app.listen(PORT, () => {
});
