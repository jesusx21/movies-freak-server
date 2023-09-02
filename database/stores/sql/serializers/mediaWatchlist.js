import { MediaWatchlist } from '../../../../app/moviesFreak/entities';
import Serializer, { field } from '../serializer';

const MediaWatchlistSerializer = Serializer
  .init(MediaWatchlist)
  .addSchema(
    field('id'),
    field('index'),
    field('watched'),
    field('film_id', { from: 'filmId' }),
    field('watchlist_id', { from: 'watchlistId' }),
    field('tv_episode_id', { from: 'tvEpisodeId' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default MediaWatchlistSerializer;
