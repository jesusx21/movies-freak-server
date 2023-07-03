import Serializer, { field } from '../serializer';
import { Film } from '../../../../app/movies-freak/entities';

const FilmSerializer = Serializer
  .init(Film)
  .addSchema(
    field('id'),
    field('name'),
    field('plot') 
  );

export default FilmSerializer;

