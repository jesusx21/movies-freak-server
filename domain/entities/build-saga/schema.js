const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] }),
  name: Joi.string(),
  plot: Joi.string(),
  numberOfMovies: Joi.number()
    .integer()
    .positive(),
  currentIndex: Joi.number()
    .integer(),
  lastMovieWatchedId: Joi.string()
    .guid({ version: ['uuidv4'] }),
  watched: Joi.boolean(),
  watchedAt: Joi.date(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
});

module.exports = schema;