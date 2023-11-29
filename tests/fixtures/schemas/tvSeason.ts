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
    tvSerieId: UUID,
    plot: STRING({ min: 10, max: 500 }),
    poster: URL,
    seasonNumber: INTEGER({ min: 1, max: 100 }),
    releasedAt: DATETIME,
    createAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'tvSerieId', 'seasonNumber']
);

export default TVSeason;
