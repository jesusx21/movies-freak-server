export default class Presenters {
  presentFilm(film) {
    return {
      id: film.id,
      name: film.name,
      plot: film.plot
    };
  }
}