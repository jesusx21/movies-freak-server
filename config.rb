require('yaml')

require('database/config')

module Configuration
  def self.load_config_file(file_path)
    file = File.read(file_path)
    config = YAML.safe_load(file)

    load_database_config(config['database'])
  end

  def self.load_database_config(data)
    database_config = Database::Configuration.new(data)

    Database.config = database_config
  end
end
