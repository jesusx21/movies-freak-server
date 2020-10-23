const omit = require('lodash.omit');

const { AddSaga } = require(`${ROOT_PATH}/app/use-cases`);

const VALIDATION_ERROR = 'VALIDATION_ERROR';

const sagaFixture = {
  name: 'It',
  plot: 'A crazy clown who likes to eat scary children',
  genre: 'Horror',
  movies: [{
    name: 'It Chapter I',
    plot: 'Where everyone is a kid',
    numberOnSaga: 1
  }, {
    name: 'It Chapter II',
    plot: 'Where everyone is an adult',
    numberOnSaga: 2
  }]
};

describe('App - Use Cases', () => {
  describe('Add Saga', () => {
    let database;

    beforeEach(() => {
      database = testUtils.getDatabase();
    });

    it('should add a saga with its movies', async () => {
      const addSaga = new AddSaga(sagaFixture, database);

      const saga = await addSaga.execute();

      expect(saga.id).to.exist;
      expect(saga.name).to.be.equal(sagaFixture.name);
      expect(saga.plot).to.be.equal(sagaFixture.plot);
      expect(saga.genre).to.be.equal(sagaFixture.genre);
      expect(saga.numberOfMovies).to.be.equal(sagaFixture.movies.length);
      expect(saga.currentIndex).to.be.equal(0);
      expect(saga.watched).to.be.false;
      expect(saga.lastMovieWatchedId).to.be.null;

      expect(saga.movies).to.have.lengthOf(saga.numberOfMovies);
      saga.movies.forEach((movie) => expect(movie.sagaId).to.be.equal(saga.id));
    });

    it('should throw error when name is not sent', () => {
      const addSaga = new AddSaga(omit({ ...sagaFixture }, 'name'), database);
      const expectedMessage = 'Input data invalid: "name" is required';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError(VALIDATION_ERROR, expectedMessage));
    });

    it('should throw error when movies is not sent', () => {
      const addSaga = new AddSaga(omit({ ...sagaFixture }, 'movies'), database);
      const expectedMessage = 'Input data invalid: "movies" is required';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError(VALIDATION_ERROR, expectedMessage));
    });

    it('should throw error when movies is empty', () => {
      const addSaga = new AddSaga({ ...sagaFixture, movies: [] }, database);
      const expectedMessage = 'Input data invalid: "movies" must contain at least 1 items';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError(VALIDATION_ERROR, expectedMessage));
    });

    it('should throw error when there are too many movies', () => {
      const movies = [];

      for (let i = 0; i < 30; i++) {
        movies.push(sagaFixture.movies[0]);
      }

      const addSaga = new AddSaga({ ...sagaFixture, movies }, database);
      const expectedMessage = 'Input data invalid: "movies" must contain less than '
        + 'or equal to 15 items';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError(VALIDATION_ERROR, expectedMessage));
    });

    it('should throw database error when create saga fails', () => {
      const fakeDatabase = {
        sagas: { create: () => Promise.reject(new Error()) }
      };

      const addSaga = new AddSaga(sagaFixture, fakeDatabase);
      const expectedMessage = 'An error occurs on creating saga: ';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('COULD_NOT_CREATE_SAGA', expectedMessage));
    });

    it('should throw database error when create movies fails', () => {
      const fakeDatabase = {
        sagas: { create: () => Promise.resolve({}) },
        movies: { create: () => Promise.reject(new Error()) }
      };

      const addSaga = new AddSaga(sagaFixture, fakeDatabase);
      const expectedMessage = 'An error occurs on creating saga: ';

      return addSaga.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('COULD_NOT_CREATE_SAGA', expectedMessage));
    });
  });
});
