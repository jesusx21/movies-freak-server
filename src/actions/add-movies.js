async function addMovies({ controllers, ...params }) {
  const saga = await controllers.addMovies(params);

  const sagaString = `Id: ${saga.id}\nTitle: ${saga.name}\nGenre: ${saga.genre}\n` +
    `Plot: ${saga.synopsis}\n`;

  let moviesString = saga.movies.map((movie) => {
    return '__________________________________________________________\n' +
      `\tId: ${movie.id}\n\tTitle: ${movie.name}\n\tPlot: ${movie.synopsis}\n`;
  });

  moviesString += '__________________________________________________________';

  console.info(sagaString);

  if (saga.movies.length > 1) {
    console.info(moviesString);
  }
}

module.exports = addMovies;
