const testUtils = require(`${ROOT_PATH}/tests/utils`);

const SAGA_RECIPE = [{
  id: '6b699ba0-310a-480a-bf8a-80405cd501eb',
  numberOfMovies: 2,
  watched: false,
  lastMovieWatchedId: undefined
}, {
  id: '598728ce-7957-4452-aa22-c0eb4468cc90',
  watched: true,
  lastMovieWatchedId: undefined
}, {
  id: 'c5b27922-a026-4477-94f5-4ec67d718b32',
  watched: true,
  lastMovieWatchedId: undefined
}, {
  id: '667c3968-7940-4ba6-8852-630cec6045f3',
  watched: false,
  lastMovieWatchedId: undefined
}];

const IMDB_RECIPE = [{
  id: 'bf32afc2-f9e2-4f08-8812-feccb615f254',
  platformId: 'tt1396484'
}, {
  id: 'fc150ea3-6cf6-4650-9068-53dc8d154f75',
  platformId: 'tt5735280'
}];

const MOVIE_RECIPE = [{
  id: '3f54d840-6e65-4b9d-b98f-cd57bc7a524f',
  name: 'Just a movie',
  sagaId: '6b699ba0-310a-480a-bf8a-80405cd501eb',
  imdbId: 'bf32afc2-f9e2-4f08-8812-feccb615f254',
  watched: true,
  numberOnSaga: 1
}, {
  id: 'f9467cd6-9a1c-4ad2-923b-41905fd2a779',
  name: 'Just another movie',
  sagaId: '6b699ba0-310a-480a-bf8a-80405cd501eb',
  imdbId: 'fc150ea3-6cf6-4650-9068-53dc8d154f75',
  watched: false,
  numberOnSaga: 2
}];

module.exports = {
  sagas: testUtils.generateFixtures('saga', SAGA_RECIPE),
  imdb: testUtils.generateFixtures('imdb', IMDB_RECIPE),
  movies: testUtils.generateFixtures('movie', MOVIE_RECIPE)
};
