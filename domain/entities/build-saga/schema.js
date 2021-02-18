const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),
  name: Joi.string(),
  plot: Joi.string()
    .optional()
    .allow(null),
  numberOfMovies: Joi.number()
    .integer()
    .positive()
    .optional(),
  currentIndex: Joi.number()
    .integer()
    .optional(),
  lastMovieWatchedId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional()
    .allow(null),
  watched: Joi.boolean()
    .optional(),
  watchedAt: Joi.date()
    .optional()
    .allow(null),
  createdAt: Joi.date()
    .optional(),
  updatedAt: Joi.date()
    .optional()
});

module.exports = schema;