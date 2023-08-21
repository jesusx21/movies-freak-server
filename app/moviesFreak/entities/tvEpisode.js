import Entity from './entity';

export default class TVEpisode extends Entity {
  constructor({
    id,
    imdbId,
    name,
    year,
    seasonNumber,
    episodeNumber,
    genre,
    director,
    writers,
    actors,
    plot,
    languages,
    country,
    poster,
    awards,
    imdbRating,
    releasedAt,
    tvSerieId,
    tvSeasonId,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.imdbId = imdbId;
    this.name = name;
    this.year = year;
    this.seasonNumber = seasonNumber;
    this.episodeNumber = episodeNumber;
    this.genre = genre;
    this.director = director;
    this.writers = writers;
    this.actors = actors;
    this.plot = plot;
    this.languages = languages;
    this.country = country;
    this.poster = poster;
    this.awards = awards;
    this.imdbRating = imdbRating;
    this.releasedAt = releasedAt;
    this.tvSerieId = tvSerieId;
    this.tvSeasonId = tvSeasonId;
  }
}
