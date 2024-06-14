import Serializer, { field } from '../serializer';
import { Film } from '../../../../app/moviesFreak/entities';
const FilmSerializer = Serializer
    .init(Film)
    .addSchema(field('id'), field('name'), field('plot'), field('title'), field('year'), field('rated'), field('runtime'), field('director'), field('poster'), field('production'), field('genre', { as: 'array' }), field('writers', { as: 'array' }), field('actors', { as: 'array' }), field('imdb_id', { from: 'imdbId' }), field('imdb_rating', { from: 'imdbRating' }), field('created_at', { from: 'createdAt' }), field('updated_at', { from: 'updatedAt' }));
export default FilmSerializer;
//# sourceMappingURL=film.js.map