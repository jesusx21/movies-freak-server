const SAGA_RECIPE = [{
  id: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  name: 'A movie',
  numberOfMovies: 2,
  watched: false,
  lastMovieWatchedId: undefined
}, {
  id: 'e9023c22-3d05-4c57-87f7-e970134e55fb',
  name: 'It',
  watched: false,
  lastMovieWatchedId: undefined
}, {
  id: '113b2c98-f434-499b-8f13-b820c3dfd5d1',
  name: 'It Follows',
  watched: false,
  lastMovieWatchedId: undefined
}, {
  id: '95e581b5-ae5d-42d7-99ad-a6b500115d44',
  name: 'It kills',
  watched: true,
  lastMovieWatchedId: undefined
}];

const MOVIE_RECIPE = [{
  id: '3f54d840-6e65-4b9d-b98f-cd57bc7a524f',
  name: 'Just a movie',
  sagaId: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  watched: true,
  numberOnSaga: 1
}, {
  id: 'b237ca52-7dae-4f74-a3e4-e3133265f2e0',
  name: 'Just another movie',
  sagaId: 'e58c4206-aea8-45f7-8efb-a7177aee2b0b',
  watched: false,
  numberOnSaga: 1
}, {
  id: '3a0ef91d-7ba0-44a4-a90f-499c1d87c315',
  name: 'It Chapter I',
  sagaId: 'e9023c22-3d05-4c57-87f7-e970134e55fb',
  watched: true,
  numberOnSaga: 1
}, {
  id: '839bf632-53db-4088-a7e8-d28aca0b1610',
  name: 'It Chapter II',
  sagaId: 'e9023c22-3d05-4c57-87f7-e970134e55fb',
  watched: false,
  numberOnSaga: 1
}, {
  id: 'faee8e84-115e-46b5-8f6c-bf9e58a2552c',
  name: 'It Follows',
  sagaId: '113b2c98-f434-499b-8f13-b820c3dfd5d1',
  watched: false,
  numberOnSaga: 1
}, {
  id: 'd784bf12-1c39-40e3-83f7-0d1eba65f664',
  name: 'It kills',
  sagaId: '95e581b5-ae5d-42d7-99ad-a6b500115d44',
  watched: true,
  numberOnSaga: 1
}];

module.exports = {
  sagas: testUtils.generateFixtures('saga', SAGA_RECIPE),
  movies: testUtils.generateFixtures('movie', MOVIE_RECIPE)
};
