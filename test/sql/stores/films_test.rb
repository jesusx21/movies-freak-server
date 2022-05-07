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

      @films = create_films
    end

    private

    def create_films(number_of_films = 10)
      Array.new(number_of_films).map do |_item|
        @db.films.create(@film)
      end
    end
  end

  class CreateFilmTest < FilmsStoreTest
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
  end

  class FindByIdTest < FilmsStoreTest
    def test_find_by_id
      film_found = @db.films.find_by_id(@films[2].id)

      assert_equal @films[2].id, film_found.id
    end

    def test_find_by_id_when_film_does_not_exist
      assert_raises MoviesFreak::Database::FilmNotFound do
        @db.films.find_by_id(generate_uuid)
      end
    end
  end
end
