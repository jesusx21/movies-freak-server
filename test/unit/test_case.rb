require('config')
require('test/test_case')

module Tests
  Configuration.load_config_file('test/unit/config.test.yml')

  class UnitTestCase < TestCase; end
end
