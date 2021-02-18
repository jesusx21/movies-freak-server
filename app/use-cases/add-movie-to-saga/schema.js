const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string()
    .required(),

  plot: Joi.string()
    .optional(),

  numberOnSaga: Joi.number()
    .integer()
    .min(1)
    .max(15)
    .required()
});

module.exports = schema;