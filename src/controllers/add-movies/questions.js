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

module.exports = {
  ADD_MOVIES_QUESTIONS,
  ADD_MOVIE_QUESTIONS,
  ADD_SAGA_QUESTIONS,
  ADD_MOVIE_SAGA_QUESTIONS
};
