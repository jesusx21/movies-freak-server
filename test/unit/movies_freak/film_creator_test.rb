require('unit/test_case')

require('movies_freak/film_creator')

module Tests
  class FilmCreatorTest < UnitTestCase
    def setup
      @db = build_database
    end

    def test_create_film
      film_creator = MoviesFreak::FilmCreator.new(
        @db,
        'Harry Potter',
        'Pelicula muy buena',
        2001
      )

      film_creator.execute
      film = film_creator.film_created

      assert_instance_of MoviesFreak::Entities::Film, film
      refute film.new?

      refute_nil film.id
      assert_equal 'Harry Potter', film.name
      assert_equal 'Pelicula muy buena', film.plot
      assert_equal 2001, film.released_year
      refute_nil film.created_at
      refute_nil film.updated_at
    end

    def test_raises_couldnt_create_film_error_when_database_error_is_raised
      @db.films
        .stubs(:create)
        .raises(MoviesFreak::Database::DatabaseError)

      film_creator = MoviesFreak::FilmCreator.new(@db, 'Harry Potter', 'Pelicula muy buena', 2001)

      assert_raises MoviesFreak::CouldntCreateFilm do
        film_creator.execute
      end
    end
  end
end
