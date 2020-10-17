class GetMovieById {
  constructor(movieId, database) {
    this._movieId = movieId;
    this._database = database;
  }

  async execute() {
    return this._database.movies.findById(this._movieId)
  }
}

module.exports = GetMovieById;
