import {
  DATETIME,
  INTEGER,
  JSON,
  STRING,
  URL,
  UUID
} from '../types';

const TVSeason = JSON(
  {
    id: UUID,
    tvSeasonId: UUID,
    plot: STRING({ min: 10, max: 500 }),
    poster: URL,
    seasonNumber: INTEGER({ min: 1, max: 100 }),
    releasedAt: DATETIME
  },
  ['id', 'tvSeasonId', 'seasonNumber']
);

export default TVSeason;
