require('movies_freak/database/stores/sql/films')

module MoviesFreak
  module Database
    class SQLDatabase
      attr_reader :connection, :films

      def initialize(connection)
        @connection = connection

        @films = Database::Stores::SQLFilms.new(@connection)
      end
    end
  end
end
