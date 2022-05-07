require('minitest/autorun')
require('securerandom')

require('config')

module Tests
  Configuration.load_config_file ENV['CONFIG_FILE_PATH']

  class TestCase < Minitest::Test
    def setup
      @db = MoviesFreak::Database.instance
    end

    def generate_uuid
      SecureRandom.uuid
    end
  end
end
