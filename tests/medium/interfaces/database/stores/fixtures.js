const testUtils = require(`${ROOT_PATH}/tests/utils`);

const SAGA_RECIPE = [{
  id: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  numberOfMovies: 2,
  watched: false,
  lastMovieWatchedId: undefined
}, {
  watched: true,
  lastMovieWatchedId: undefined
}, {
  watched: true,
  lastMovieWatchedId: undefined
}, {
  watched: false,
  lastMovieWatchedId: undefined
}];

const MOVIE_RECIPE = [{
  id: '3f54d840-6e65-4b9d-b98f-cd57bc7a524f',
  name: 'Just a movie',
  sagaId: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  watched: true,
  numberOnSaga: 1
}, {
  id: 'f9467cd6-9a1c-4ad2-923b-41905fd2a779',
  name: 'Just another movie',
  sagaId: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  watched: false,
  numberOnSaga: 2
}];

module.exports = {
  sagas: testUtils.generateFixtures('saga', SAGA_RECIPE),
  movies: testUtils.generateFixtures('movie', MOVIE_RECIPE)
};
