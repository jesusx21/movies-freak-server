import Serializer, { field } from '../serializer';
import { TVEpisode } from '../../../../app/moviesFreak/entities';

const TVEpisodeSerializer = Serializer
  .init<TVEpisode>(TVEpisode)
  .addSchema(
    field('id'),
    field('name'),
    field('year'),
    field('director'),
    field('plot'),
    field('country'),
    field('poster'),
    field('awards'),
    field('genre', { as: 'array' }),
    field('writers', { as: 'array' }),
    field('actors', { as: 'array' }),
    field('languages', { as: 'array' }),
    field('imdb_id', { from: 'imdbId' }),
    field('season_number', { from: 'seasonNumber' }),
    field('episode_number', { from: 'episodeNumber' }),
    field('imdb_rating', { from: 'imdbRating' }),
    field('released_at', { from: 'releasedAt' }),
    field('tv_serie_id', { from: 'tvSerieId' }),
    field('tv_season_id', { from: 'tvSeasonId' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default TVEpisodeSerializer;
