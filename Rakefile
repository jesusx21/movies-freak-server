$LOAD_PATH << File.dirname(__FILE__)

require('rake')
require 'rake/testtask'
require('sequel')

require('config')
require('database/connection')

config_file = ENV['CONFIG_FILE_PATH'] || 'config.yml'

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
  end

  desc('Drops the database')
  task :drop do
    database_config = Database.config

    sh "#{build_postgres_vars(database_config)} dropdb #{database_config.database_name}"
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

# Test tasks
desc('Run SQL tests')
task :test do
  Rake::TestTask.new do |t|
    ENV['ENV'] = 'test'
    ENV['CONFIG_FILE_PATH'] = 'test/config_sql.yml'

    begin
      Rake::Task['db:drop'].execute
    rescue StandardError => error
      pp error
    end

    Rake::Task['db:create'].execute
    Rake::Task['migrate:latest'].execute

    t.libs << 'test'
    t.libs << './'
    t.test_files = FileList['test/**/*_test.rb']
  end
end

task default: [:test]
