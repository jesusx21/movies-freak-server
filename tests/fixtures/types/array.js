export default function ARRAY(itemsType, options = {}) {
  const { min, max } = options;
  const value = {
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
