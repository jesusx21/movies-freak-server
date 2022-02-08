$LOAD_PATH << File.dirname(__FILE__)

require('rake')
require('sequel')

require('config')
require('database/connection')

config_file = ENV['CONFIG_FILE'] || 'config.yml'

Configuration.load_config_file(config_file)

def build_postgres_vars(database_config)
  vars = []

  vars.push("PGHOST=#{database_config.host}") unless database_config.host.nil?
  vars.push("PGUSER=#{database_config.username}") unless database_config.username.nil?
  vars.push("PGPASSWORD=#{database_config.password}") unless database_config.password.nil?

  vars.join(' ')
end

# Database tasks
namespace :db do
  desc('Creates a new database')
  task :create do
    database_config = Database.config

    sh "#{build_postgres_vars(database_config)} createdb #{database_config.database_name}"

    puts("Database #{database_config.database_name} created!")
  end

  desc('Drops the database')
  task :drop do
    database_config = Database.config

    sh "#{build_postgres_vars(database_config)} dropdb #{database_config.database_name}"
    puts("Database #{database_config.database_name} dropped!")
  end

  desc('Drops the database')
  task :reset do
    sh 'rake db:drop && rake db:create'
  end
end

# Migration tasks
namespace :migrate do
  Sequel.extension :migration

  desc('Run migrations')
  task :latest do
    Database.connection.run('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    Sequel::Migrator.run(Database.connection, './migrations', column: :migrations)
  end
end
