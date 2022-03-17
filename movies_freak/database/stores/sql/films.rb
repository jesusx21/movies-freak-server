require('movies_freak/database/errors')
require('movies_freak/entities/film')

module MoviesFreak
  module Database
    module Stores
      class SQLFilms
        def initialize(connection)
          @connection = connection
        end

        def create(film)
          raise FilmAlreadyCreated unless film.new?

          begin
            result = @connection[:films]
                     .returning(Sequel.lit('*'))
                     .insert(
                       name: film.name,
                       plot: film.plot,
                       released_year: film.released_year
                     )
                     .first
          rescue StandardError => error
            raise Database::DatabaseError, error
          end

          build_film(result)
        end

        def find_by_id(film_id)
          begin
            result = @connection[:films]
                     .where(id: film_id)
                     .first
          rescue StandardError => error
            raise Database::DatabaseError, error
          end

          raise Database::FilmNotFound, film_id if result.nil?

          build_film(result)
        end

        private

        def build_film(data)
          MoviesFreak::Entities::Film.new(
            id: data[:id],
            name: data[:name],
            plot: data[:plot],
            released_year: data[:released_year],
            created_at: data[:created_at],
            updated_at: data[:updated_at]
          )
        end
      end
    end
  end
end
