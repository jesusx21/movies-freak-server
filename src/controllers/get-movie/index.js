const prompts = require('prompts');


function getMovies({ actions, database }) {
  return actions.getRandomMovies({ numberOfMovies: 1, database })
    .then(movies => onGetRandomMovieSuccess(movies[0]))
    .catch(onGetRandomMoviesError);
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
