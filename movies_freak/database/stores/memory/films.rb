require('movies_freak/database/errors')
require('movies_freak/database/stores/memory/store')

module MoviesFreak
  module Database
    module Stores
      class MemoryFilms
        def initialize
          @store = MemoryStore.new
        end

        def create(film)
          @store.create(film)
        rescue EntityAlreadyCreated
          raise Database::FilmAlreadyCreated
        rescue StandardError => error
          raise Database::DatabaseError, error
        end

        def find_by_id(film_id)
          @store.find_by_id(film_id)
        rescue EntityNotFound
          raise Database::FilmNotFound, film_id
        rescue StandardError => error
          raise Database::DatabaseError, error
        end
      end
    end
  end
end
