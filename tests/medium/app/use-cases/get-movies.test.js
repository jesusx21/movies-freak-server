const { expect } = require('chai');

const { GetMovies } = require(`${ROOT_PATH}/app/use-cases`);
const testUtils = require(`${ROOT_PATH}/tests/utils`);
const fixtures = require('./fixtures');

describe('App - Use Cases', () => {
  describe('Get Movies', () => {
    let database;

    beforeEach(async () => {
      database = testUtils.getDatabase();

      await testUtils.resetDatabase();
      await testUtils.loadFixtures(fixtures);
    });

    it('should get movies', async () => {
      const getMovies = new GetMovies({}, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(6);
    });

    it('should get movies with limit', async () => {
      const getMovies = new GetMovies({ limit: 4 }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(4);
    });

    it('sould get movies by saga id', async () => {
      const sagaId = '6b699ba0-310a-480a-bf8a-80405cd501eb';
      const getMovies = new GetMovies({ sagaId }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(2);
      movies.forEach((movie) => expect(movie.sagaId).to.be.equal(sagaId));
    });

    it('should get movies by name', async () => {
      const name = 'it';
      const getMovies = new GetMovies({ name }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(4);
      movies.forEach((movie) => expect(movie.name.toLowerCase()).to.have.string(name));
    });

    it('should get movies watched', async () => {
      const getMovies = new GetMovies({ watched: true }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(3);
      movies.forEach((movie) => expect(movie.watched).to.be.true);
    });

    it(' should get movies not watched', async () => {
      const getMovies = new GetMovies({ watched: false }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(3);
      movies.forEach((movie) => expect(movie.watched).to.be.false);
    });

    it('should get movies watched by saga id', async () => {
      const sagaId = 'e9023c22-3d05-4c57-87f7-e970134e55fb';
      const getMovies = new GetMovies({ sagaId, watched: true }, database);

      const movies = await getMovies.execute();

      expect(movies).to.have.lengthOf(1);
      expect(movies[0].watched).to.be.true;
      expect(movies[0].sagaId).to.be.equal(sagaId);
    });

    it('should throw error when getting movies by fields not supported', () => {
      const getMovies = new GetMovies({ plot: 'This is a plot' }, database);
      const expectedMessage = 'Input data invalid: "plot" is not allowed';

      return getMovies.execute()
        .then(testUtils.onUnexpectedPath)
        .catch(testUtils.validateError('VALIDATION_ERROR', expectedMessage));
    });

    it('should throw error when getting movies throws an unexpected error', () => {
      const fakeDatabase = {
        movies: { find: () => Promise.reject(new Error()) }
      };

      const getMovies = new GetMovies({}, fakeDatabase);
      const expectedMessage = 'An error occurs when getting movies: ';

      return getMovies.execute()
        .then(testUtils.onUnexpectedPath)
        .catch(testUtils.validateError('ERROR_GETTING_MOVIES', expectedMessage));
    });
  });
});
