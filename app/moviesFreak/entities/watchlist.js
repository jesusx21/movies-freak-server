import Entity from './entity';

export default class Watchlist extends Entity {
  constructor({
    id,
    name,
    type,
    description,
    totalFilms,
    totalTVEpisodes,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.name = name;
    this.type = type;
    this.description = description;
    this.totalFilms = totalFilms;
    this.totalTVEpisodes = totalTVEpisodes;
  }
}
