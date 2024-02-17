const {
  STATUS_CONFLICT,
  STATUS_SERVER_ERROR,
} = process.env;

module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(STATUS_CONFLICT).send({ message: 'Пользователь с такой почтой уже существует' });
  } else if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(STATUS_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
  next();
};
