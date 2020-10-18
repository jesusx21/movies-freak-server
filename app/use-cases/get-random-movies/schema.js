const Joi = require('joi');

const schema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .required()
});

module.exports = schema;
