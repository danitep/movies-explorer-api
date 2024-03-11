const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  PORT = 3000,
} = process.env;

const DB_URL = process.env.NODE_ENV !== 'production'
  ? 'mongodb://127.0.0.1:27017/bitfilmsdb'
  : process.env.DB_URL;

const app = express();

const allowedCors = {
  origin: [
    'http://danitepdiplomfront.nomoredomainswork.ru',
    'https://danitepdiplomfront.nomoredomainswork.ru',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
};

app.use(cors(allowedCors));
app.use(helmet());

const { limiter } = require('./middlewares/rateLimiter');

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);

const routes = require('./routes/index');

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

const errorHandler = require('./errors/central-handler');

app.use(errorHandler);

app.listen(PORT, () => {
});
