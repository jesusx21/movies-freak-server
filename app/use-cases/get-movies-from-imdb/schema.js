const Joi = require('joi');

const schema = Joi.object({
  imdbId: Joi.string()
    .optional(),

  name: Joi.string()
    .optional(),

  year: Joi.number()
    .integer()
    .optional(),

  page: Joi.number()
    .integer()
    .min(1)
    .optional()
});

module.exports = schema;
