interface IntegerOptions {
  min?: number;
  max?: number;
}

interface IntegerType {
  type: 'integer';
  minimum?: number;
  maximum?: number;
}

function INTEGER(options: IntegerOptions = {}) {
  const { min, max } = options;
  const value: IntegerType = { type: 'integer' };

  if (min) {
    value.minimum = min;
  }

  if (max) {
    value.maximum = max;
  }

  return value;
}

export default INTEGER;
