require('movies_freak/database/stores/memory/films')

module MoviesFreak
  module Database
    class MemoryDatabase
      attr_reader :films

      def initialize
        @films = Database::Stores::MemoryFilms.new
      end
    end
  end
end
