export default function INTEGER(options = {}) {
  const { min, max } = options;
  const value = { type: 'integer' };

  if (min) {
    value.minimum = min;
  }

  if (max) {
    value.maximum = max;
  }

  return value;
}
