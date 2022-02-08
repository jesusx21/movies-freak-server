require('sequel')

require('config')

module Database
  def self.connection
    @connection = Sequel.connect(Database.config.dsn) if @connection.nil?

    @connection
  end
end
