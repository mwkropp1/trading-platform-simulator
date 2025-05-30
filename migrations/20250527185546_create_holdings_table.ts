import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('holdings', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('asset_id').notNullable().references('id').inTable('assets').onDelete('CASCADE');
    table.decimal('quantity', 20, 6).notNullable().defaultTo(0);
    table.decimal('avg_price_usd', 14, 4).notNullable().defaultTo(0);
    table.timestamps(true, true);

    table.unique(['user_id', 'asset_id']);

    table.index(['user_id', 'asset_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('holdings');
}
