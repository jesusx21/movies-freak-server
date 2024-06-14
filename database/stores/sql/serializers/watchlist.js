import Serializer, { field } from '../serializer';
import { Watchlist } from '../../../../app/moviesFreak/entities';
const WatchlistSerializer = Serializer
    .init(Watchlist)
    .addSchema(field('id'), field('name'), field('type'), field('description'), field('total_films', { from: 'totalFilms' }), field('total_tv_episodes', { from: 'totalTVEpisodes' }), field('created_at', { from: 'createdAt' }), field('updated_at', { from: 'updatedAt' }));
export default WatchlistSerializer;
//# sourceMappingURL=watchlist.js.map