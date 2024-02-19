import {
  ARRAY,
  DATETIME,
  FULL_NAME,
  GENRE,
  IMDB_ID,
  INTEGER,
  JSON,
  RATED,
  RATING,
  STRING,
  UUID,
  YEAR
} from './types';

const tvSerie = JSON(
  {
    id: UUID,
    name: STRING({ min: 1, max: 100 }),
    plot: STRING({ min: 10, max: 500 }),

    years: JSON(
      {
        from: YEAR,
        to: YEAR
      },
      ['from', 'to']
    ),

    rated: RATED,
    genre: ARRAY(GENRE, { min: 1, max: 3 }),
    writers: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    actors: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    imdbId: IMDB_ID,
    imdbRating: RATING,
    totalSeasons: INTEGER({ min: 1, max: 100 }),
    releasedAt: DATETIME,
    createAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'imdbId', 'name', 'plot', 'totalSeasons']
);

export default tvSerie;
