require('test/sql/test_case')

require('movies_freak/database')
require('movies_freak/database/errors')
require('movies_freak/entities/film')

module Tests
  class FilmsStoreTest < TestCase
    def setup
      super

      @film = MoviesFreak::Entities::Film.new(
        name: 'Spider-Man: Homecoming',
        plot: 'A young man is bitten by a radioactive spider',
        released_year: 2017
      )
    end

    def test_create
      film_created = @db.films.create(@film)

      assert_instance_of MoviesFreak::Entities::Film, film_created
      refute_nil film_created.id
      assert_equal @film.name, film_created.name
      assert_equal @film.plot, film_created.plot
      assert_equal @film.released_year, film_created.released_year
      refute_nil film_created.created_at
      refute_nil film_created.updated_at
    end

    def test_find_by_id
      film_created = @db.films.create(@film)
      film_found = @db.films.find_by_id(film_created.id)

      assert_equal film_created.id, film_found.id
    end

    def test_find_by_id_when_film_does_not_exist
      @db.films.create(@film)
      @db.films.create(@film)

      assert_raises MoviesFreak::Database::FilmNotFound do
        @db.films.find_by_id(generate_uuid)
      end
    end
  end
end
