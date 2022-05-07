require('securerandom')

module MoviesFreak
  module Database
    module Stores
      class EntityAlreadyCreated < StandardError; end

      class MemoryStore
        def initialize
          @items = {}
        end

        def create(entity)
          raise EntityAlreadyCreated unless entity.new?

          entity.id = SecureRandom.uuid
          entity.created_at = Time.now
          entity.updated_at = Time.now

          @items[entity.id] = entity

          entity
        end

        def find_by_id(entity_id)
          entity = @items[entity_id]

          raise EntityNotFound, entity_id if entity.nil?

          entity
        end
      end
    end
  end
end
