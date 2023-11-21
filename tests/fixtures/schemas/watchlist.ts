import {
  ENUM,
  INTEGER,
  JSON,
  STRING,
  UUID
} from '../types';

const watchlist = JSON(
  {
    id: UUID,
    name: STRING({ min: 1, max: 100 }),
    type: ENUM('films', 'tv-episodes', 'all'),
    description: STRING({ min: 10, max: 500 }),
    totalFilms: INTEGER({ min: 0, max: 250 }),
    totalTVEpisodes: INTEGER({ min: 0, max: 250 })
  },
  ['id', 'name', 'description', 'totalFilms', 'totalTVEpisodes']
);

export default watchlist;
