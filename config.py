import os
from configparser import ConfigParser


class Config(ConfigParser):
    def __init__(self, config_file_path='config.ini'):
        super().__init__(os.environ)

        dir_path = os.path.dirname(os.path.realpath(__file__))

        self._config_file_path = os.path.normpath(os.path.join(dir_path, '.', config_file_path))

        self.read(self._config_file_path)

    def get_sql_database_connection_url(self):
        driver = self.get('database', 'driver')
        host = self.get('database', 'host', fallback='localhost')
        port = self.getint('database', 'port', fallback=5432)
        username = self.get('database', 'username')
        password = self.get('database', 'password', fallback=None)
        database = self.get_database_name()

        if password:
            return 'postgresql+%s://%s:%s@%s:%s/%s' % (
                driver, username, password, host, port, database
            )

        return 'postgresql+%s://%s@%s:%s/%s' % (
            driver, username, host, port, database
        )

    def get_database_name(self):
        return self.get('database', 'database')
