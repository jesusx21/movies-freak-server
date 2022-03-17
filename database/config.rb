require('ostruct')

module Database
  def self.config=(config)
    @config = config if @config.nil?
  end

  def self.config
    @config
  end

  class Configuration
    def initialize(config)
      @config = OpenStruct.new(config)
    end

    def dsn
      uri = "#{adapter}://"
      uri += "#{username}:#{password}@" unless username.nil?
      uri += host
      uri += ":#{port}" unless port.nil?
      uri += "/#{database_name}"

      uri.freeze
    end

    def adapter
      @config.adapter.to_sym
    end

    def username
      @config.username
    end

    def password
      @config.password
    end

    def host
      @config.host
    end

    def port
      @config.port
    end

    def database_name
      @config.database_name
    end

    def encoding
      @config.encoding
    end

    def maximum_connections
      @config.maximum_connections
    end
  end
end
