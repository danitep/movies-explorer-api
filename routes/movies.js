const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/not-found-err');

const {
  createMovie,
  getAllMovies,
  deleteMovie,
} = require('../controllers/movies');

const { urlChecking } = require('../utils/urlChecking');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlChecking),
    trailerLink: Joi.string().required().pattern(urlChecking),
    thumbnail: Joi.string().required().pattern(urlChecking),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.get('/', getAllMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

router.all('/:any', () => {
  throw new NotFoundError('Неверный путь');
});

module.exports = router;
