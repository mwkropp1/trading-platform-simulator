import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('assets').del();

  const cryptoAssets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      exchange: 'coinbase',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      exchange: 'coinbase',
    },
  ];

  const stockAssets = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      exchange: 'nasdaq',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      type: 'stock',
      exchange: 'nasdaq',
    },
  ];

  await knex('assets').insert([...cryptoAssets, ...stockAssets]);
}
