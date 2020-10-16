const prompts = require('prompts');

const database = require('./src/database');
const useCases = require('./src/use-cases');
const controllers = require('./src/controllers');
const actions = require('./src/actions');
const buildQuestions = require('./src/questions');

async function initializeApp() {
  const questions = buildQuestions();

  const option = await questions.makeMainQuestion();
  const params = { controllers, questions, useCases, database };

  if (option === 'add') {
    await actions.addMovies(params);
  }

  if (option === 'choose') {
    await actions.getMovie(params)
  }

  if (option === 'pick') {
    await actions.getMovies(params);
  }

  if (option === 'find_by_id') {
    await actions.findMovieById(params);
  }

  if (option === 'find_by_name') {
    await actions.findMovieByName(params);
  }

  if (option === 'get_watched') {
    await actions.getMoviesWatched(params);
  }

  if (option === 'finish') {
    console.info('You chose to finish the app');
    return
  }

  await initializeApp()
}



function resolve() {
  console.log('Finishin app ...');
  console.log('App finished');

  process.exit(0);
}

function reject(error) {
  console.log(error)
  console.log('An error happens');
  console.error(`\nError Name: ${error.name}\nError Message: ${error.message}`);

  process.exit(1);
}

initializeApp()
  .then(resolve)
  .catch(reject);
