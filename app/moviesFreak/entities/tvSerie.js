import Entity from './entity';

export default class TVSerie extends Entity {
  constructor({
    id,
    imdbId,
    name,
    plot,
    years,
    rated,
    genre,
    writers,
    actors,
    poster,
    imdbRating,
    totalSeasons,
    releasedAt,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.imdbId = imdbId;
    this.name = name;
    this.plot = plot;
    this.years = years;
    this.rated = rated;
    this.genre = genre;
    this.writers = writers;
    this.actors = actors;
    this.poster = poster;
    this.imdbRating = imdbRating;
    this.totalSeasons = totalSeasons;
    this.releasedAt = releasedAt;
  }
}
