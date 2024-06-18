import Serializer, { field } from '../serializer';
import { Watchlist } from '../../../../app/moviesFreak/entities';

const WatchlistSerializer = Serializer
  .init<Watchlist>(Watchlist)
  .addSchema(
    field('id'),
    field('name'),
    field('privacity'),
    field('description'),
    field('total_films', { from: 'totalFilms' }),
    field('total_tv_episodes', { from: 'totalTVEpisodes' }),
    field('user_id', { from: 'userId' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default WatchlistSerializer;
