const jwt = require('jsonwebtoken');
const UnautorizedError = require('../errors/not-authorized-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    const jwtSecretWord = process.env.NODE_ENV !== 'production'
      ? 'not-secret-key'
      : process.env.JWT_SECRET;
    payload = jwt.verify(token, jwtSecretWord);
  } catch (err) {
    throw new UnautorizedError('Неверный токен');
  }

  req.user = payload;

  next();
};
