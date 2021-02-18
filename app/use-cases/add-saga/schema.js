const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string()
    .required(),
  plot: Joi.string()
    .optional(),
  movies: Joi.array().items(
    Joi.object({
      imdbId: Joi.string()
        .required(),
      name: Joi.string()
        .optional(),
      plot: Joi.string()
        .optional(),
      numberOnSaga: Joi.number()
        .integer()
        .min(1)
        .max(15)
        .required(),
    })
  )
    .min(1)
    .max(15)
    .required()
});

module.exports = schema;
