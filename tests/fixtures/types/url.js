const URL = {
  type: 'string',
  format: 'uri',
  // eslint-disable-next-line max-len
  pattern: '(https:\\/\\/www\\.|http:\\/\\/www\\.|https:\\/\\/|http:\\/\\/)?[a-zA-Z0-9]{2,}(\\.[a-zA-Z0-9]{2,})(\\.[a-zA-Z0-9]{2,})?'
};

export default URL;
