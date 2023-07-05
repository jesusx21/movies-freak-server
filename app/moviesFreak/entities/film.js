export default class Film {
  constructor({
    id,
    name,
    plot,
    title,
    year,
    rated,
    runtime,
    director,
    poster,
    production,
    genre,
    writers,
    actors,
    imdbId,
    imdbRating
  }) {
    this._id = id;
    this.name = name;
    this.plot = plot;
    this.title = title;
    this.year = year;
    this.rated = rated;
    this.runtime = runtime;
    this.director = director;
    this.poster = poster;
    this.production = production;
    this.genre = genre;
    this.writers = writers;
    this.actors = actors;
    this.imdbId = imdbId;
    this.imdbRating = imdbRating;
  }

  get id() {
    return this._id;
  }
}
