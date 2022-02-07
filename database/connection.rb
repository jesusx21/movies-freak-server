require('sequel')

$LOAD_PATH << File.join(File.dirname(__FILE__), '../')

require('config')

module Database
  def self.connection
    @connection = Sequel.connect(Database.config.dsn) if @connection.nil?

    @connection
  end
end

Database.connection
