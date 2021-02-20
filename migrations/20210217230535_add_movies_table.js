const TABLE_NAME = 'movies';

exports.up = function(knex) {
  return knex.raw('CREATE EXTENSION "uuid-ossp"')
    .then(() => {
      return knex.schema.createTable(TABLE_NAME, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('name').notNull();
        table.text('plot').notNull();
        table.text('watch_on');
        table.timestamp('released_at');

        table.timestamps(true, true);
      });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
    .then(() => knex.raw('DROP EXTENSION "uuid-ossp"'));
};
