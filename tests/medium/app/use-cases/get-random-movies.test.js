const { GetRandomMovies } = require(`${ROOT_PATH}/app/use-cases`);
const { expect } = require('chai');
const fixtures = require('./fixtures');

describe('App - Use Cases', () => {
  describe('Get Movies', () => {
    let database;

    beforeEach(async () => {
      database = testUtils.getDatabase();

      await testUtils.resetDatabase();
      await testUtils.loadFixtures(fixtures);
    });

    it('should get random movies', async () => {
      const getRandomMovies = new GetRandomMovies({ limit: 2 }, database);

      const movies = await getRandomMovies.execute();

      expect(movies).to.have.lengthOf(2);
    });

    it('should get movies on limit equals to movies to watch', async () => {
      const getRandomMovies = new GetRandomMovies({ limit: 3 }, database);

      const movies = await getRandomMovies.execute();

      expect(movies).to.have.lengthOf(3);
    });

    it('sould get movies on limit greater than movies to watch', async () => {
      const getRandomMovies = new GetRandomMovies({ limit: 15 }, database);

      const movies = await getRandomMovies.execute();

      expect(movies).to.have.lengthOf(3);
    });

    it('should throw an error when limit is not sent', () => {
      const expectedMessage = 'Input data invalid: "limit" is required';

      const getRandomMovies = new GetRandomMovies({}, database);

      return getRandomMovies.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('VALIDATION_ERROR', expectedMessage));
    });

    it('should throw an error when there is no more movies to watch', () => {
      const fakeDatabase = { sagas: { findUnwatched: () => Promise.resolve([]) } };
      const expectedMessage = 'There is not any movie to watch';

      const getRandomMovies = new GetRandomMovies({ limit: 5 }, fakeDatabase);

      return getRandomMovies.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('MOVIES_TO_WATCH_NOT_FOUND', expectedMessage));
    });

    it('should throw error when getting movies froom sagas', () => {
      const fakeDatabase = {
        ...database,
        movies: { findNextBySagaId: () => Promise.reject(new Error()) }
      };

      const getRandomMovies = new GetRandomMovies({ limit: 2 }, fakeDatabase);
      const expectedMessage = 'An error occurs when getting movies: ';

      return getRandomMovies.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('ERROR_GETTING_MOVIES', expectedMessage));
    });

    it('should throw error when getting movies froom sagas', () => {
      const fakeDatabase = {
        ...database,
        movies: { findNextBySagaId: () => Promise.reject(new Error()) }
      };

      const getRandomMovies = new GetRandomMovies({ limit: 1 }, fakeDatabase);
      const expectedMessage = 'An error occurs when getting movies: ';

      return getRandomMovies.execute()
        .then(testUtils.unexpectedPath)
        .catch(testUtils.validateError('ERROR_GETTING_MOVIES', expectedMessage));
    });
  });
});
