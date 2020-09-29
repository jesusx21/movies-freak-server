const prompts = require('prompts');

const QUESTION = require('./questions');

async function initializeApp() {
  const {option} = await prompts(QUESTION);

  if (option === 'add') {
    console.info('You choose to add a movie');
  }

  if (option === 'choose') {
    console.info('You choose to choose a movie');
  }

  if (option === 'pick') {
    console.info('You choose to pick movies to choose');
  }

  if (option === 'finish') {
    console.info('You choose to finish the app');
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
  console.log('An error occurs');
  console.error('Error:', error);

  process.exit(1);
}

initializeApp()
  .then(resolve)
  .catch(reject);
