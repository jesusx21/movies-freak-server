const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string()
    .required(),

  plot: Joi.string()
    .optional(),

  genre: Joi.string()
    .optional(),

  movies: Joi.array().items(
    Joi.object({
      name: Joi.string()
        .required(),

      plot: Joi.string()
        .optional(),

      numberOnSaga: Joi.number()
        .integer()
        .min(1)
        .max(15)
        .required(),
    })
    .min(1)
    .max(15)
  )
});

module.exports = schema;