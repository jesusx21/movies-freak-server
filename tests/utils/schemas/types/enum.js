function buildEnumType(enumArray) {
  return {
    type: 'string',
    enum: enumArray
  };
};

module.exports = buildEnumType;
