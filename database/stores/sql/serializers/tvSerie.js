import Serializer, { field } from '../serializer';
import { TVSerie } from '../../../../app/moviesFreak/entities';

const TVSerieSerializer = Serializer
  .init(TVSerie)
  .addSchema(
    field('id'),
    field('name'),
    field('plot'),
    field('rated'),
    field('poster'),
    field('years', { as: 'json' }),
    field('genre', { as: 'array' }),
    field('writers', { as: 'array' }),
    field('actors', { as: 'array' }),
    field('imdb_id', { from: 'imdbId' }),
    field('imdb_rating', { from: 'imdbRating' }),
    field('total_seasons', { from: 'totalSeasons' }),
    field('released_at', { from: 'releasedAt' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default TVSerieSerializer;
