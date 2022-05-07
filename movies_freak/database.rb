require('database/config')
require('database/connection')
require('movies_freak/database/memory_database')
require('movies_freak/database/sql_database')

module MoviesFreak
  module Database
    class AdapterNotSupported < StandardError; end

    def self.instance
      adapter = ::Database.config.adapter

      if adapter == :postgresql
        MoviesFreak::Database::SQLDatabase.new ::Database.connection
      elsif adapter == :memory
        MoviesFreak::Database::MemoryDatabase.new
      else
        raise AdapterNotSupported
      end
    end
  end
end
