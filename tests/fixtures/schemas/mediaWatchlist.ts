import {
  BOOLEAN,
  DATETIME,
  INTEGER,
  JSON,
  UUID
} from './types';

const mediaWatchlist = JSON(
  {
    id: UUID,
    watchlistId: UUID,
    filmId: UUID,
    tvEpisodeId: UUID,
    index: INTEGER({ min: 0, max: 200 }),
    watched: BOOLEAN,
    createAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'watchlistId', 'filmId', 'tvEpisodeId', 'index']
);

export default mediaWatchlist;
