const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] }),
  title: Joi.string(),
  year: Joi.number()
    .integer()
    .positive(),
  rated: Joi.string(),
  releasedAt: Joi.date(),
  runtime: Joi.number()
    .integer()
    .positive(),
  genre: Joi.string(),
  director: Joi.string(),
  actors: Joi.string(),
  plot: Joi.string(),
  country: Joi.string(),
  awards: Joi.string(),
  poster: Joi.string()
    .uri(),
  imdbRating: Joi.number()
    .positive(),
  rotenTomatoesRating: Joi.string(),
  imdbVotes: Joi.number()
    .integer(),
  imdbId: Joi.string(),
  production: Joi.string(),
  website: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date()
});

module.exports = schema;
