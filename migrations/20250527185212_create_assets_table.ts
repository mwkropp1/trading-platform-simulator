import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('assets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('symbol').notNullable().unique();
    table.string('name').notNullable();
    table.enum('type', ['stock', 'crypto', 'etf', 'forex']).notNullable();
    table.string('exchange').nullable();
    table.decimal('price_usd', 14, 4).nullable();
    table.timestamp('last_updated').nullable();
    table.timestamps(true, true);

    table.index('symbol');
    table.index('type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('assets');
}