const IMDB_ID = {
  type: 'string',
  pattern: 'ev\\d{7}\\/\\d{4}(-\\d)?|(ch|co|ev|nm|tt)\\d{7}'
};

export default IMDB_ID;
