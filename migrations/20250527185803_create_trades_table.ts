import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('trades', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('asset_id').notNullable().references('id').inTable('assets').onDelete('CASCADE');
    table.enum('type', ['buy', 'sell']).notNullable();
    table.decimal('quantity', 20, 6).notNullable();
    table.decimal('price_usd', 14, 4).notNullable();
    table
      .enum('status', ['pending', 'completed', 'cancelled'])
      .notNullable()
      .defaultTo('completed');
    table.timestamp('trade_date').defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table.index('user_id');
    table.index('asset_id');
    table.index('trade_date');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('trades');
}
