function REGEX(pattern: string) {
  return {
    type: 'string',
    min: 2,
    pattern
  };
}

export default REGEX;
