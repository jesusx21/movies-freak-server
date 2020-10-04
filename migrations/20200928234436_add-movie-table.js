exports.up = function(knex) {
  return knex.schema.createTable('movies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('name');
    table.text('synopsis');
    table.uuid('saga_id').references('sagas.id').notNull();
    table.boolean('watched').defaultTo(false);
    table.integer('number_on_saga');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('movies');
};
