const ADD_MOVIE_QUESTIONS = [{
  type: 'text',
  name: 'name',
  message: 'Type the name of the movie'
},
{
  type: 'text',
  name: 'synopsis',
  message: 'Type the synopsis of the movie'
},
{
  type: 'text',
  name: 'genre',
  message: 'Type the genre of the movie'
}];

const ADD_MOVIES_QUESTIONS = {
  type: 'select',
  name: 'option',
  message: 'Pick an option',
  choices: [{
    title: 'Add a movie',
    value: 'add_movie'
  },
  {
    title: 'Add a saga',
    value: 'add_saga'
  },
  {
    title: 'Add a movie from a saga',
    value: 'add_movie_saga'
  },
  {
    title: 'Return to main',
    value: 'main'
  }]
};

const ADD_MOVIE_SAGA_QUESTIONS = [{
  type: 'text',
  name: 'name',
  message: 'Type the name of the movie'
},
{
  type: 'text',
  name: 'synopsis',
  message: 'Type the synopsis of the movie'
},
{
  type: 'number',
  name: 'numberOnSaga',
  message: 'Type the number of the movie in the saga'
}];

const ADD_SAGA_QUESTIONS = [{
  type: 'text',
  name: 'name',
  message: 'Type the name of the saga'
},
{
  type: 'text',
  name: 'synopsis',
  message: 'Type the synopsis of the saga'
},
{
  type: 'text',
  name: 'genre',
  message: 'Type the genre of the saga'
},
{
  type: 'number',
  name: 'numberOfMovies',
  message: 'Type the number of movies that has the saga'
}];

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

const MARK_AS_WATCHED_QUESTION = {
  type: 'toggle',
  name: 'markAsWatched',
  message: 'Mark movie as watched?',
  active: 'Yes',
  inactive: 'No'
};

const PICK_MOVIES_QUESTION = {
  type: 'number',
  name: 'numberOfMovies',
  message: 'Number of random movies to show'
};

module.exports = {
  ADD_MOVIE_QUESTIONS,
  ADD_MOVIES_QUESTIONS,
  ADD_MOVIE_SAGA_QUESTIONS,
  ADD_SAGA_QUESTIONS,
  MAIN_QUESTION,
  MARK_AS_WATCHED_QUESTION,
  PICK_MOVIES_QUESTION
};
