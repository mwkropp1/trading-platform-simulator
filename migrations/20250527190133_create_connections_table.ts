import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('connections', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('connection_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('connected_at').defaultTo(knex.fn.now());

    table.unique(['user_id', 'connection_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('connections');
}
