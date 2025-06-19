import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('assets', table => {
    table.string('coincap_id').nullable();
    table.index('coincap_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('assets', table => {
    table.dropColumn('coincap_id');
  });
}
