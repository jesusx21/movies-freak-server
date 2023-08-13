import Entity from './entity';

export default class TVSeason extends Entity {
  constructor({
    id,
    tvSerieId,
    seasonNumber,
    plot,
    poster,
    releasedAt,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.tvSerieId = tvSerieId;
    this.seasonNumber = seasonNumber;
    this.plot = plot;
    this.poster = poster;
    this.releasedAt = releasedAt;
  }
}
