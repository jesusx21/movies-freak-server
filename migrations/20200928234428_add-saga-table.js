exports.up = function(knex) {
  return knex.raw('CREATE EXTENSION "uuid-ossp"')
    .then(() => {
      return knex.schema.createTable('sagas', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('name');
        table.text('synopsis');
        table.integer('number_of_movies').notNull();
        table.integer('current_index').notNull();
        table.boolean('watched');

        table.timestamps(true, true);
      });
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('sagas')
    .then(() => knex.raw('DROP EXTENSION "uuid-ossp"'));
};
