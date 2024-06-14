class Presenters {
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
            writers: film.writers,
            actors: film.actors,
            imdbId: film.imdbId,
            imdbRating: film.imdbRating
        };
    }
    presentFilms(films) {
        return films.map(this.presentFilm.bind(this));
    }
    presentTVSerie(tvSerie) {
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
    presentTVSeries(tvSeries) {
        return tvSeries.map(this.presentTVSerie.bind(this));
    }
    presentSession(session) {
        var _a, _b;
        return {
            id: session.id,
            token: session.token,
            expiresAt: session.expiresAt,
            isActive: session.isActive(),
            user: {
                id: (_a = session.user) === null || _a === void 0 ? void 0 : _a.id,
                name: (_b = session.user) === null || _b === void 0 ? void 0 : _b.name
            }
        };
    }
}
export default Presenters;
//# sourceMappingURL=presenters.js.map