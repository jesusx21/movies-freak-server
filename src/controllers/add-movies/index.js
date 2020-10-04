const prompts = require('prompts');

const {
  ADD_MOVIES_QUESTIONS,
  ADD_MOVIE_QUESTIONS,
  ADD_SAGA_QUESTIONS,
  ADD_MOVIE_SAGA_QUESTIONS
} = require('./questions');

async function addMovies({ actions, database }) {
  const { option } = await prompts(ADD_MOVIES_QUESTIONS);

  if (option === 'add_movie') {
    const sagaData = await prompts(ADD_MOVIE_QUESTIONS);
    const saga = await actions.addSaga({ ...sagaData, database });
    const movie = await actions.addMovie({
      ...sagaData, database, numberOnSaga: 1, sagaId: saga.id
    });

    return `\nId: ${movie.id}\nMovie: ${movie.name}\nSynopsis: ${movie.synopsis}\n` +
           `Genre: ${saga.genre}\n`;
  }

  if (option === 'add_saga') {
    const sagaData = await prompts(ADD_SAGA_QUESTIONS);
    const saga = await actions.addSaga({ ...sagaData, database });

    let movies = '';

    for (let i = 0; i < sagaData.numberOfMovies; i++) {
      const movieData = await prompts(ADD_MOVIE_SAGA_QUESTIONS);
      const movie = await actions.addMovie({
        ...movieData, database, sagaId: saga.id
      });

      movieDescription = `\tMovie: ${movie.name}\n\tSynopsis: ${movie.synopsis}`;
      console.log(`\n${movieDescription}\n`);
      movies += `${movieDescription}\n__________________________________________________________\n`;
    }

    return `Saga: ${saga.name}\nSynopsis: ${saga.synopsis}\nGenre: ${saga.genre}\n${movies}`;
  }

  if (option === 'add_movie_saga') {
    return 'Not implemented yet';
  }
}

module.exports = addMovies;
