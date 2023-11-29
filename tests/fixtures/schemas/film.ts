import {
  ARRAY,
  DATETIME,
  FULL_NAME,
  GENRE,
  IMDB_ID,
  JSON,
  RATED,
  RATING,
  REGEX,
  STRING,
  URL,
  UUID,
  YEAR
} from '../types';

const film = JSON(
  {
    id: UUID,
    name: STRING({ min: 1, max: 100 }),
    plot: STRING({ min: 10, max: 500 }),
    title: STRING({ min: 1, max: 100 }),
    year: YEAR,
    rated: RATED,
    runtime: REGEX('^[1-9][0-9]?[0-9]? min'),
    director: FULL_NAME,
    poster: URL,
    genre: ARRAY(GENRE, { min: 1, max: 3 }),
    writers: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    actors: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    imdbId: IMDB_ID,
    imdbRating: RATING,
    createAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'imdbId', 'name', 'plot']
);

export default film;
