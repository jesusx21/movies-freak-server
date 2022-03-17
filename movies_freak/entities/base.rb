require('movies_freak/entities/errors')

module MoviesFreak
  module Entities
    class EntityBase
      attr_reader :id, :created_at, :updated_at

      def initialize(id: nil, created_at: nil, updated_at: nil)
        @id = id
        @created_at = created_at
        @updated_at = updated_at
      end

      def new?
        @id.nil?
      end

      def id=(value)
        raise IdAlreadySet unless @id.nil?

        @id = value
      end

      def created_at=(value)
        raise UpdatedAtAlreadySet unless @created_at.nil?

        @created_at = value
      end

      def updated_at=(value)
        raise UpdatedAtAlreadySet unless @updated_at.nil?

        @updated_at = value
      end
    end
  end
end
