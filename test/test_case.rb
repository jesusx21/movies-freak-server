require('minitest/autorun')
require('mocha/minitest')
require('securerandom')
require('webmock/minitest')

require('config')
require('movies_freak/database')

module Tests
  class TestCase < Minitest::Test
    def build_database
      MoviesFreak::Database.instance
    end

    def generate_uuid
      SecureRandom.uuid
    end
  end
end
