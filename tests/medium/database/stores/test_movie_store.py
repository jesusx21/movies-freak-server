from datetime import datetime

from unittest.mock import patch
from sqlalchemy import create_engine

from tests.medium.database import TestCase

from database.stores.errors import InvalidData, InvalidId, EntityNotFound, UnexpectedDatabaseError
from entities.movie import MovieEntity

class TestCreate(TestCase):
    def setUp(self):
        super().setUp()
        self.database = self.get_database()

    def test_create_movie(self):
        movie_entity = MovieEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )
        movie = self.database.movies.create(movie_entity)

        self.assertIsInstance(movie, MovieEntity)

        self.assertIsNotNone(movie.id)
        self.assertIsNotNone(movie.created_at)
        self.assertIsNotNone(movie.updated_at)

        self.assertEqual(movie.title, 'Avengers')
        self.assertEqual(movie.plot, 'A bunch of superheroes saving the world')
        self.assertEqual(movie.watch_on, 'Disney+')
        self.assertEqual(movie.released_at, movie_entity.released_at)

    def test_raises_error_when_creating_data_is_invalid(self):
        movie_entity = MovieEntity(
            title='Avengers',
            plot=None,
            watch_on='Disney+',
            released_at=datetime.now()
        )

        with self.assertRaises(InvalidData):
            self.database.movies.create(movie_entity)

    def test_raises_error_when_creating_movie_fails(self):
        movie_entity = MovieEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )

        with patch.object(self.database.movies, '_execute') as mock:
            mock.side_effect = Exception()

            with self.assertRaises(UnexpectedDatabaseError):
                self.database.movies.create(movie_entity)



class TestFindById(TestCase):
    def setUp(self):
        super().setUp()

        self.database = self.get_database()
        self.movie = self._create_movie()

    def test_find_by_id(self):
        movie = self.database.movies.find_by_id(self.movie.id)

        self.assertIsInstance(movie, MovieEntity)

        self.assertEqual(movie.id, self.movie.id)
        self.assertEqual(movie.title, 'Avengers')
        self.assertEqual(movie.plot, 'A bunch of superheroes saving the world')
        self.assertEqual(movie.watch_on, 'Disney+')
        self.assertEqual(movie.released_at, self.movie.released_at)
        self.assertEqual(movie.created_at, self.movie.created_at)
        self.assertEqual(movie.updated_at, self.movie.updated_at)

    def test_find_by_id_raises_error_on_invalid_id(self):
        with self.assertRaises(InvalidId):
            self.database.movies.find_by_id('self.movie.id')

    def test_find_by_id_raises_error_when_movie_does_not_exist(self):
        with self.assertRaises(EntityNotFound):
            self.database.movies.find_by_id(1000)

    def test_find_by_id_raises_error_when_database_fails(self):
        with patch.object(self.database.movies, '_execute') as mock:
            mock.side_effect = Exception()

            with self.assertRaises(UnexpectedDatabaseError):
                self.database.movies.find_by_id(1)

    def _create_movie(self):
        movie = MovieEntity(
            title='Avengers',
            plot='A bunch of superheroes saving the world',
            watch_on='Disney+',
            released_at=datetime.now()
        )

        return self.database.movies.create(movie)
