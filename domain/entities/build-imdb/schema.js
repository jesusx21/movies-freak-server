const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  title: Joi.string()
    .optional(),
  year: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  rated: Joi.string()
    .optional()
    .allow(null),
  releasedAt: Joi.date()
    .optional()
    .allow(null),
  runtime: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  genre: Joi.string()
    .optional()
    .allow(null),
  director: Joi.string()
    .optional()
    .allow(null),
  actors: Joi.string()
    .optional()
    .allow(null),
  plot: Joi.string()
    .optional()
    .allow(null),
  country: Joi.string()
    .optional()
    .allow(null),
  awards: Joi.string()
    .optional()
    .allow(null),
  poster: Joi.string()
    .uri()
    .optional()
    .allow(null),
  imdbRating: Joi.number()
    .positive()
    .optional()
    .allow(null),
  rottenTomatoesRating: Joi.string()
    .optional()
    .allow(null),
  imdbVotes: Joi.number()
    .integer()
    .optional()
    .allow(null),
  platformId: Joi.string()
    .optional()
    .allow(null),
  production: Joi.string()
    .optional()
    .allow(null),
  website: Joi.string()
    .optional()
    .allow(null),
  createdAt: Joi.date()
    .optional(),
  updatedAt: Joi.date()
    .optional()
});

module.exports = schema;
