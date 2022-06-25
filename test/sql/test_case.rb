require('config')
require('test/test_case')

module Tests
  Configuration.load_config_file('test/sql/config.test.yml')

  class SQLTestCase < TestCase; end
end
