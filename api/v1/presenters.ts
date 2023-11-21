import { Film, Session, TVSerie } from '../../app/moviesFreak/entities';

class Presenters {
  presentFilm(film: Film) {
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
      writers: film.writers,
      actors: film.actors,
      imdbId: film.imdbId,
      imdbRating: film.imdbRating
    };
  }

  presentFilms(films: Film[]) {
    return films.map(this.presentFilm.bind(this));
  }

  presentTVSerie(tvSerie: TVSerie) {
    return {
      id: tvSerie.id,
      imdbId: tvSerie.imdbId,
      name: tvSerie.name,
      plot: tvSerie.plot,
      years: tvSerie.years,
      rated: tvSerie.rated,
      genre: tvSerie.genre,
      writers: tvSerie.writers,
      actors: tvSerie.actors,
      poster: tvSerie.poster,
      imdbRating: tvSerie.imdbRating,
      totalSeasons: tvSerie.totalSeasons,
      releasedAt: tvSerie.releasedAt
    };
  }

  presentTVSeries(tvSeries: TVSerie[]) {
    return tvSeries.map(this.presentTVSerie.bind(this));
  }

  presentSession(session: Session) {
    return {
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
      isActive: session.isActive,
      user: {
        id: session.user?.id,
        name: session.user?.name
      }
    };
  }
}

export default Presenters;
