exports.up = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.uuid('last_movie_watched');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('sagas', (table) => {
    table.dropColumn('last_movie_watched');
  });
};
