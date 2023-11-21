interface StringOptions {
  min?: number;
  max?: number;
}

interface StringType {
  type: 'string';
  minLength?: number;
  maxLength?: number;
}

function STRING(options: StringOptions = {}) {
  const { min, max } = options;

  const value: StringType = { type: 'string' };

  if (min) {
    value.minLength = min;
  }

  if (max) {
    value.maxLength = max;
  }

  return value;
}

export default STRING;
