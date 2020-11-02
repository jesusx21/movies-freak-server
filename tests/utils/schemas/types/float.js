const isNil = require('lodash.isNil')

function buildIntegerType(options = {}) {
  const { min, max } = options;

  const type = { type: 'number' };

  if (isNil(min) && isNil(max)) return type;
  if (isNil(min)) return { ...type, maximum: max };
  if (isNil(max)) return { ...type, minimum: min };
  if (min >= max) throw new Error('min value must be less than max value')

  return { ...type, maximum: max, minimum: min };
};

module.exports = buildIntegerType;
