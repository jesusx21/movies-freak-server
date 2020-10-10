module.exports = (options = {}) => {
  const {allowEmpty = true} = options;
  const type = { type: 'string' };

  if (!allowEmpty) type.minLength = 1;
  return type;
};
