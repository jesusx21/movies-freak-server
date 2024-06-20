import Serializer, { field } from '../serializer';
import { MediaWatchlist } from '../../../../app/moviesFreak/entities';

const MediaWatchlistSerializer = Serializer
  .init<MediaWatchlist>(MediaWatchlist)
  .addSchema(
    field('id'),
    field('index'),
    field('watched'),
    field('media_type', { from: 'mediaType' }),
    field('film_id', { from: 'filmId' }),
    field('watchlist_id', { from: 'watchlistId' }),
    field('tv_episode_id', { from: 'tvEpisodeId' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default MediaWatchlistSerializer;
