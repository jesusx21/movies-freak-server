export default function REGEX(pattern) {
  return {
    type: 'string',
    min: 2,
    pattern
  };
}
