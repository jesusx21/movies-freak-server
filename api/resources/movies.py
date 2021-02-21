import humps
from falcon import HTTP_CREATED

from app.errors import HTTPConflict, HTTPInternalServerError
from core import AddMovie
from core.errors import CouldNotAddMovie, MovieAlreadyAdded


class MoviesResource:
    def __init__(self, database, movies_fetcher):
        self._database = database
        self._movies_fetcher = movies_fetcher

    def on_post(self, req, resp):
        imdb_id = req.media['imdb_id']

        use_case = AddMovie(self._database, self._movies_fetcher, imdb_id)

        try:
            movie_added = use_case.execute()
        except MovieAlreadyAdded:
            raise HTTPConflict('MOVIE_ALREADY_ADDED')
        except CouldNotAddMovie as error:
            raise HTTPInternalServerError('UNEXPECTED_ERROR', error)
        except Exception as error:
            print(error)
            raise HTTPInternalServerError('UNEXPECTED_ERROR', error)

        resp.status = HTTP_CREATED
        resp.media = humps.camelize(movie_added)
