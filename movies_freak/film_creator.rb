require('movies_freak/database/errors')
require('movies_freak/entities/film')
require('movies_freak/errors')

module MoviesFreak
  class FilmCreator
    def initialize(db, name, plot, released_year)
      @db = db
      @name = name
      @plot = plot
      @released_year = released_year
    end

    def execute
      film = Entities::Film.new(
        name: @name,
        plot: @plot,
        released_year: @released_year
      )

      @film = @db.films.create(film)
    rescue Database::DatabaseError => error
      raise CouldntCreateFilm, error
    end

    def film_created
      @film
    end
  end
end
