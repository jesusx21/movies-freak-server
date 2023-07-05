export default class Film {
  constructor(args) {
    this._id = args.id;
    this.name = args.name;
    this.plot = args.plot;
    this.title = args.title;
    this.year = args.year;
    this.rated = args.rated;
    this.runtime = args.runtime;
    this.director = args.director;
    this.poster = args.poster;
    this.production = args.production;
    this.genre = args.genre;
    this.writer = args.writer;
    this.actors = args.actors;
    this.imdbId = args.imdbId;
    this.imdbRating = args.imdbRating;
  }

  get id() {
    return this._id;
  }
}