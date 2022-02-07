# Movies Freak
This app is made only for those cinephiles that want to organize the films they want to watch

## What do I need to set the project up
First we need to have rbenv and postgresql install

```shell
$ brew install rbenv
$ brew install postgresql
```

Then we need to set the environment
```shell
$ mkdir -p ./.env/ruby/bin
$ touch ./.env/ruby/bin/activate
$ echo 'export RBENV_ROOT="$( cd "$(dirname "$0")"/.. ; pwd -P )"' >> ./.env/ruby/bin/activate
$ echo 'eval "$(rbenv init -)"' >> ./.env/ruby/bin/activate
$ source ./.env/ruby/bin/activate
$ rbenv install 3.1.0
$ rbenv local 3.1.0
$ rbenv global 3.1.0
$ rbenv rehash
$ export PATH=./env/ruby/versions/3.1.0/bin:$PATH
```

And install bundle and the dependencies
```shell
$ gem install bundle
$ bundle install
```

To set up the configuration we need to create a copy of the file `config.sample.yml`
```shell
$ cp config.sample.yml config.yml
```
