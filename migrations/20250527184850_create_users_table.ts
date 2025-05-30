import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.decimal('cash_balance', 12, 2).defaultTo(100000);
    table.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
    table.timestamps(true, true);

    table.index('email');
    table.index('username');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
