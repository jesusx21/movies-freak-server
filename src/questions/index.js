const prompts = require('prompts');
const isEmpty = require('lodash.isempty');

const QUESTIONS = require('./questions');
const { NotImplemented } = require('./../errors');

function buildQuestions() {
  const getAddMovieOption = async () => {
    const { option } = await prompts(QUESTIONS.ADD_MOVIES_QUESTIONS);

    if (option === 'add_movie') {
      return getMovieData();
    }

    if (option === 'add_saga') {
      return getSagaData();
    }

    if (option === 'add_movie_saga') {
      return Promise.reject(new NotImplemented());
    }
  };

  const getMovieData = async () => {
    const data = await prompts(QUESTIONS.ADD_MOVIE_QUESTIONS);

    return data;
  };

  const getSagaData = async () => {
    const sagaData = await prompts(QUESTIONS.ADD_SAGA_QUESTIONS);

    sagaData.movies = [];

    for (let i = 0; i < sagaData.numberOfMovies; i++) {
      console.log('\n');

      const movieData = await prompts(QUESTIONS.ADD_MOVIE_SAGA_QUESTIONS);
      sagaData.movies.push(movieData);
    }

    return sagaData;
  }

  const makeMainQuestion = async () => {
    const { option } = await prompts(QUESTIONS.MAIN_QUESTION);

    return option
  }

  const markMovieAsWatched = async () => {
    const { markAsWatched } = await prompts(QUESTIONS.MARK_AS_WATCHED_QUESTION);

    return markAsWatched;
  }

  const getNumberOfMoviesToShow = async () => {
    const { numberOfMovies } = await prompts(QUESTIONS.PICK_MOVIES_QUESTION);

    return numberOfMovies;
  }

  const showMovies = async (movies) => {
    if (isEmpty(movies)) return;

    const choices = movies.map((movie) => {
      return {
        title: `${movie.id} ${movie.name}`,
        value: movie.id,
        description: movie.plot
      }
    });

    choices.push({
      title: 'Back',
      value: null,
      description: 'Regresar a menú principal'
    });

    const question = {
      type: 'select',
      name: 'movieId',
      message: 'Choose a movie to watch',
      choices
    };
    const { movieId } = await prompts(question);

    return movieId
  }

  const getMovieId = async () => {
    const { movieId } = await prompts(QUESTIONS.FIND_BY_ID_QUESTION);

    return movieId;
  }

  const getMovieName = async () => {
    const { movieName } = await prompts(QUESTIONS.FIND_BY_NAME_QUESTION);

    return movieName;
  }

  return {
    getAddMovieOption,
    getMovieData,
    getSagaData,
    makeMainQuestion,
    markMovieAsWatched,
    getNumberOfMoviesToShow,
    showMovies,
    getMovieId,
    getMovieName
  };
}

module.exports = buildQuestions
