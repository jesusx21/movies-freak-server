export default function STRING(options = {}) {
  const { min, max } = options;

  const value = { type: 'string' };

  if (min) {
    value.minLength = min;
  }

  if (max) {
    value.maxLength = max;
  }

  return value;
}
