const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found-err');

// Обработка ошибок
function checkCreatingRequest(name, email, password) {
  if (!email || !password) {
    throw new BadRequest('Некорректные введённые данные');
  }
}
function checkSendining(user) {
  if (!user) {
    throw new NotFoundError('Пользователь не найден');
  }
}
function sendData(res, data) {
  const {
    name,
    email,
  } = data;
  res.status(200).send({
    name,
    email,
  });
}
function sendCreatedData(res, data) {
  const {
    name,
    email,
  } = data;
  res.status(201).send({
    name,
    email,
  });
}

function checkUpdatingRequest(body) {
  const { name } = body;
  if (!name) {
    throw new BadRequest('Некорректные введённые данные');
  }
}

// Контроллеры
module.exports.createUser = (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;
    checkCreatingRequest(name, email, password);
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((user) => {
        checkSendining(user);
        sendCreatedData(res, user);
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      checkSendining(user);
      sendData(res, user);
    })
    .catch((err) => next(err));
};

module.exports.updatePorfile = (req, res, next) => {
  try {
    checkUpdatingRequest(req.body);
    User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    })
      .then((user) => {
        checkSendining(user);
        sendData(res, user);
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const jwtSecretWord = process.env.NODE_ENV !== 'production'
        ? 'not-secret-key'
        : process.env.JWT_SECRET;
      const token = jwt.sign(
        { _id: user._id },
        jwtSecretWord,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};
