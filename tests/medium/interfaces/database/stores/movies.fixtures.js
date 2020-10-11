const SAGA_RECIPE = [{
  id: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  numberOfMovies: 2,
  lastMovieWatchedId: undefined
}];

const MOVIE_RECIPE = [{
  id: '3f54d840-6e65-4b9d-b98f-cd57bc7a524f',
  name: 'Just a movie',
  sagaId: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  watched: false,
  numberOnSaga: 1
}];

module.exports = {
  sagas: testUtils.generateFixtures('saga', SAGA_RECIPE),
  movies: testUtils.generateFixtures('movie', MOVIE_RECIPE)
};