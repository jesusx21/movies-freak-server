import { Type } from '../interface';

interface ArrayOptions {
  min?: number;
  max?: number;
}

interface ArrayType {
  type: 'array';
  items: Type,
  minItems?: number;
  maxItems?: number;
}

function ARRAY(itemsType: Type, options: ArrayOptions = {}) {
  const { min, max } = options;
  const value: ArrayType = {
    type: 'array',
    items: itemsType
  };

  if (min) {
    value.minItems = min;
  }

  if (max) {
    value.maxItems = max;
  }

  return value;
}

export default ARRAY;
