from database.tables import Movies
from database.stores.store import Store
from entities import MovieEntity


class MoviesStore(Store):
    def __init__(self, engine):
        super().__init__(engine, Movies)

    def _deserialize(self, result):
        data = super()._deserialize(result)

        return MovieEntity(**data)
