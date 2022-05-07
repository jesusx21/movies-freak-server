require('movies_freak/entities/base')

module MoviesFreak
  module Entities
    class Film < EntityBase
      attr_reader :name, :plot, :released_year

      def initialize(name:, plot:, released_year:, id: nil, created_at: nil, updated_at: nil)
        super(id: id, created_at: created_at, updated_at: updated_at)

        @name = name
        @plot = plot
        @released_year = released_year
      end
    end
  end
end
