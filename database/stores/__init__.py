from database.stores.movies import MoviesStore


class Database:
    def __init__(self, engine):
        self.movies = MoviesStore(engine)
