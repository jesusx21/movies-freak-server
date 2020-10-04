const MAIN_QUESTION = {
  type: 'select',
  name: 'option',
  message: 'Pick an option',
  choices: [{
    title: 'Add movies',
    value: 'add',
    description: 'This option will allows you to add a movie to the database'
  },
  {
    title: 'Choose a movie',
    value: 'choose',
    description: 'This option will pick a movie to watch'
  },
  {
    title: 'Pick movies',
    value: 'pick',
    description: 'This option will shows you three movies for you to pick one of them'
  },
  {
    title: 'Finish',
    value: 'finish',
    description: 'This option will close the app'
  }]
};

const PICK_MOVIES_QUESTION = {
  type: 'number',
  name: 'numberOfMovies',
  message: 'Number of random movies to show'
}

module.exports = {
  MAIN_QUESTION,
  PICK_MOVIES_QUESTION
};
