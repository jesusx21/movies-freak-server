const prompts = require('prompts');
const isEmpty = require('lodash.isempty');

const actions = require('./../../actions');
const database = require('../../database');

async function getMovies({ actions, data, database }) {
  const { numberOfMovies } = data;

  return actions.getRandomMovies({ numberOfMovies, database })
    .then(movies => {
      if (movies.length < numberOfMovies) {
        console.info(`There are only ${movies.length} movie(s) to watch`)
      }

      return onPickMoviesSucess(movies);
    })
    .catch(onGetRandomMoviesError);
}

async function onPickMoviesSucess(movies) {
  if (isEmpty(movies)) return;

  const choices = movies.map((movie) => {
    return {
      title: movie.name,
      value: movie.id,
      description: movie.synopsis
    }
  });

  const question = {
    type: 'select',
    name: 'movieId',
    message: 'Choose a movie to watch',
    choices
  };

  const { movieId } = await prompts(question);
  await database.movies.findById(movieId)
    .then(onGetRandomMovieSuccess)
    .catch(onGetRandomMoviesError);

  const moviesLeft = movies.filter(item => item.id !== movieId);
  return onPickMoviesSucess(moviesLeft);
}

async function onGetRandomMovieSuccess(movie) {
  console.info(`Time to watch ${movie.name}`);

  const { markAsWatched } = await prompts(MARK_AS_WATCHED_QUESTION);

  if (markAsWatched) {
    await actions.markMovieAsWatched({ database, movieId: movie.id })
  }
}

async function onGetRandomMoviesError(error) {
  if (error.name === 'MOVIES_TO_WATCH_NOT_FOUND') {
    console.error('\nThere is no movies to watch, add more or mark all as unwatched\n');
  } else {
    console.error('\nAn unexpected error occurs');
    console.error(`\nError Name: ${error.name}\nError Message: ${error.message}`)
  }
}

const MARK_AS_WATCHED_QUESTION = {
  type: 'toggle',
  name: 'markAsWatched',
  message: 'Mark movie as watched?',
  active: 'Yes',
  inactive: 'No'
}

module.exports = getMovies;
