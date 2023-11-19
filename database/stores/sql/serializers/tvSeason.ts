import Serializer, { field } from '../serializer';
import { TVSeason } from '../../../../app/moviesFreak/entities';

const TVSeasonSerializer = Serializer
  .init<TVSeason>(TVSeason)
  .addSchema(
    field('id'),
    field('plot'),
    field('poster'),
    field('tv_serie_id', { from: 'tvSerieId' }),
    field('season_number', { from: 'seasonNumber' }),
    field('released_at', { from: 'releasedAt' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default TVSeasonSerializer;
