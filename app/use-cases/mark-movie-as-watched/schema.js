const Joi = require('joi');

const schema = Joi.object({
  movieId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .required(),

  watchedAt: Joi.date()
    .optional()
});

module.exports = schema;
