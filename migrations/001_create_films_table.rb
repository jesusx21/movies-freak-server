require('sequel')

Sequel.migration do
  up do
    create_table(:films) do
      primary_key :id, type: :uuid, default: Sequel.lit('gen_random_uuid()')
      String :name, null: false
      String :plot
      Integer :released_year

      DateTime :created_at, null: false, default: Sequel.lit('now()')
      DateTime :updated_at, null: false, default: Sequel.lit('now()')
    end
  end

  down do
    drop_table(:films)
  end
end
