const uuid = require('uuid');

const fixtures = require('./fixtures');

const SAGA_ID = 'e58c4206-aea8-45f7-8efb-a7177aee2b0b';
const MOVIE_ID = '3f54d840-6e65-4b9d-b98f-cd57bc7a524f';

describe('Interfaces - Database', () => {
  describe('Stores', () => {
    describe('Movies Store', () => {
      let database;

      beforeEach(async () => {
        database = testUtils.getDatabase();

        await testUtils.resetDatabase();
        await testUtils.loadFixtures(fixtures);
      });

      describe('Create', () => {
        it('should return the movie created', async () => {
          const data = {
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          const movie = await database.movies.create(data);

          expect(movie.id).to.exist;
          expect(movie.name).to.be.equal(data.name);
          expect(movie.plot).to.be.equal(data.plot);
          expect(movie.sagaId).to.be.equal(SAGA_ID);
          expect(movie.watched).to.be.false;
          expect(movie.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(movie.createdAt).to.be.equalDate(new Date());
          expect(movie.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error on invalid data', () => {
          const data = {
            name: 'Movie',
            synopsis: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          return database.movies.create(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INVALID_INPUT_DATA'));
        });
      });

      describe('Find By Id', () => {
        it('should return movie by its id', async () => {
          const movie = await database.movies.findById(MOVIE_ID);

          expect(movie.id).to.be.equal(MOVIE_ID);
          expect(movie.name).to.be.equal('Just a movie');
          expect(movie.sagaId).to.be.equal(SAGA_ID);
          expect(movie.watched).to.be.false;
          expect(movie.numberOnSaga).to.be.equal(1);
        });

        it('should return error when movie was not found', () => {
          const unexistentMovieId = uuid.v4();

          return database.movies.findById(unexistentMovieId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Movie with id "${unexistentMovieId}" was not found`
              );
            });
        });

        it('should return error when id is invalid', () => {
          const invalidId = 'invalid-id';

          return database.movies.findById(invalidId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('INVALID_ID');
              expect(error.message).to.be.equal(`Id "${invalidId}" is not a uuid`);
            });
        })
      });

      describe('Update', () => {
        it('should update the movie', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          const movie = await database.movies.update(data);

          expect(movie.id).to.exist;
          expect(movie.name).to.be.equal(data.name);
          expect(movie.plot).to.be.equal(data.plot);
          expect(movie.sagaId).to.be.equal(SAGA_ID);
          expect(movie.watched).to.be.false;
          expect(movie.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(movie.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error when movie does not exist', async () => {
          const data = {
            id: uuid.v4(),
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 1
          };

          return database.movies.update(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Movie with id "${data.id}" was not found`
              );
            });
        });

        it('should return error on invalid data', async () => {
          const data = {
            id: MOVIE_ID,
            name: 'Movie',
            plot: 'This is a movie plot',
            sagaId: SAGA_ID,
            watched: false,
            numberOnSaga: 'invalid-integer'
          };

          return database.movies.update(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INVALID_INPUT_DATA'));
        });
      });
    });
  });
});
