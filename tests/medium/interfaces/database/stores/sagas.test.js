const uuid = require('uuid');

const fixtures = require('./fixtures');

const SAGA_ID = 'e58c4206-aea8-45f7-8efb-a7177aee2b0b';
const MOVIE_ID = '3f54d840-6e65-4b9d-b98f-cd57bc7a524f';

describe('Interfaces - Database', () => {
  describe('Stores', () => {
    describe('Sagas Store', () => {
      let database;

      beforeEach(async () => {
        database = testUtils.getDatabase();

        await testUtils.resetDatabase();
        await testUtils.loadFixtures(fixtures);
      });

      describe('Create', () => {
        it('should return the saga created', async () => {
          const data = {
            name: 'Harry Potter',
            plot: 'This is a movie plot',
            watched: false,
            numberOfMovies: 8
          };

          const saga = await database.sagas.create(data);

          expect(saga.id).to.exist;
          expect(saga.name).to.be.equal(data.name);
          expect(saga.plot).to.be.equal(data.plot);
          expect(saga.watched).to.be.false;
          expect(saga.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(saga.createdAt).to.be.equalDate(new Date());
          expect(saga.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error on invalid data', () => {
          const data = {
            name: 'Harry Potter',
            synopsis: 'This is a movie plot',
            watched: false
          };

          return database.sagas.create(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => expect(error.name).to.be.equal('INVALID_INPUT_DATA'));
        });
      });

      describe('Find By Id', () => {
        it('should return saga by its id', async () => {
          const saga = await database.sagas.findById(SAGA_ID);

          expect(saga.id).to.be.equal(SAGA_ID);
          expect(saga.numberOfMovies).to.be.equal(2);
          expect(saga.watched).to.be.false;
        });

        it('should return error when movie was not found', () => {
          const unexistentMovieId = uuid.v4();

          return database.sagas.findById(unexistentMovieId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Saga with id "${unexistentMovieId}" was not found`
              );
            });
        });

        it('should return error when id is invalid', () => {
          const invalidId = 'invalid-id';

          return database.sagas.findById(invalidId)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('INVALID_ID');
              expect(error.message).to.be.equal(`Id "${invalidId}" is not a uuid`);
            });
        })
      });

      describe('Update', () => {
        it('should update the saga', async () => {
          const data = {
            id: SAGA_ID,
            name: 'Movie',
            watched: true,
            numberOfMovies: 8
          };

          const saga = await database.sagas.update(data);

          expect(saga.id).to.be.equal(SAGA_ID);
          expect(saga.name).to.be.equal(data.name);
          expect(saga.watched).to.be.true;
          expect(saga.numberOnSaga).to.be.equal(data.numberOnSaga);
          expect(saga.updatedAt).to.be.equalDate(new Date());
        });

        it('should return error when saga does not exist', async () => {
          const data = {
            id: uuid.v4(),
            name: 'Movie',
            plot: 'This is a saga plot',
            watched: false,
            numberOfMovies: 1
          };

          return database.sagas.update(data)
            .then(() => Promise.reject(new Error('unexpected path')))
            .catch((error) => {
              expect(error.name).to.be.equal('ENTITY_NOT_FOUND');
              expect(error.message).to.be.equal(
                `Saga with id "${data.id}" was not found`
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
