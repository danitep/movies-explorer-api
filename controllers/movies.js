const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

// Обработка ошибок
function checkSendiningAllMovies(movies) {
  if (!movies[0]) {
    throw new NotFoundError('Фильмы не найдены');
  }
}
function checkSendining(movie) {
  if (!movie) {
    throw new NotFoundError('Фильм не найден');
  }
}
function sendData(res, data) {
  res.send(data);
}
function sendCreatedData(res, data) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  } = data;
  res.status(201).send({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  });
}

// Контроллеры
module.exports.createMovie = (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner,
    })
      .then((movie) => {
        checkSendining(movie);
        sendCreatedData(res, movie);
      })
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      checkSendiningAllMovies(movies);
      sendData(res, movies);
    })
    .catch((err) => next(err));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId, owner: req.user._id })
    .then((movie) => {
      checkSendining(movie);
      if (req.user._id !== movie.owner.toHexString()) {
        throw new Forbidden('Разрешено удаление только собственных фильмов');
      }
      Movie.deleteOne(movie)
        .then(() => {
          checkSendining(movie);
          sendData(res, movie);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
