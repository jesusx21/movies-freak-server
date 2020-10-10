function buildObjectType (properties, required = []) {
  return {
    type: 'object',
    properties,
    required
  };
};

module.exports = buildObjectType;
