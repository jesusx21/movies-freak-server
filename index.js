const prompts = require('prompts');

const database = require('./src/database');
const actions = require('./src/actions');
const controllers = require('./src/controllers');

const {
  MAIN_QUESTION,
  PICK_MOVIES_QUESTION
} = require('./questions');

async function initializeApp() {
  const { option } = await prompts(MAIN_QUESTION);
  const params = { actions, database };

  if (option === 'add') {
    const response = await controllers.addMovies(params);
    console.info(response);
  }

  if (option === 'choose') {
    await controllers.getMovie(params)
  }

  if (option === 'pick') {
    const { numberOfMovies } = await prompts(PICK_MOVIES_QUESTION);
    await controllers.getMovies({ ...params, data: { numberOfMovies } });
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
  console.log('An error happens');
  console.error(`\nError Name: ${error.name}\nError Message: ${error.message}`);

  process.exit(1);
}

initializeApp()
  .then(resolve)
  .catch(reject);
