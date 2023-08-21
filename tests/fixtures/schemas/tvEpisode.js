import {
  ARRAY,
  DATETIME,
  ENUM,
  FULL_NAME,
  GENRE,
  IMDB_ID,
  INTEGER,
  JSON,
  RATING,
  STRING,
  URL,
  UUID,
  YEAR
} from '../types';

const tvEpisode = JSON(
  {
    id: UUID,
    imdbId: IMDB_ID,
    name: STRING({ min: 1, max: 200 }),
    year: YEAR,
    seasonNumber: INTEGER({ min: 1, max: 100 }),
    episodeNumber: INTEGER({ min: 1, max: 100 }),
    genre: ARRAY(GENRE, { min: 1, max: 3 }),
    director: FULL_NAME,
    writers: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    actors: ARRAY(FULL_NAME, { min: 1, max: 5 }),
    plot: STRING({ min: 10, max: 500 }),
    languages: ARRAY(
      ENUM('English', 'French', 'Spanish', 'Japaneese'),
      { min: 1, max: 3 }
    ),
    country: ENUM(
      'United States',
      'Mexico',
      'Japan'
    ),
    poster: URL,
    awards: STRING({ min: 1, max: 20 }),
    imdbRating: RATING,
    releasedAt: DATETIME,
    tvSerieId: UUID,
    tvSeasonId: UUID,
    createdAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'name', 'seasonNumber', 'episodeNumber']
);

export default tvEpisode;
