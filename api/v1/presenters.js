export default class Presenters {
  presentFilm(film) {
    return {
      id: film.id,
      name: film.name,
      plot: film.plot,
      title: film.title,
      year: film.year,
      rated: film.rated,
      runtime: film.runtime,
      director: film.director,
      poster: film.poster,
      production: film.production,
      genre: film.genre,
      writer: film.writer,
      actors: film.actors,
      imdbId: film.imdbId,
      imdbRating: film.imdbRating
    };
  }
}