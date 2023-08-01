const URL = {
  type: 'string',
  // eslint-disable-next-line max-len, no-useless-escape
  pattern: '^https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$',
  minLength: 50,
  maxLength: 250
};

export default URL;