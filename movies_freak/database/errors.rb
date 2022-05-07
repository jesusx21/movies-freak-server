module MoviesFreak
  module Database
    class DatabaseError < StandardError; end

    class NotFound < DatabaseError; end
    class FilmNotFound < NotFound; end
  end
end
