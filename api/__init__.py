from api.resources.movies import MoviesResource # noqa

class MoviesFreakApp:
    def __init__(self, app):
        self._app = app

    def install(self):
        database = self._app.get_database()
        movies_fetcher = self._app.get_movies_fetcher()

        self._app.register_resource('movies', MoviesResource(database, movies_fetcher))
