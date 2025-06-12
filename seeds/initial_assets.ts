import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('assets').del();

  const cryptoAssets = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      source: 'coincap',
      metadata: {
        description: 'Digital gold',
        website: 'https://bitcoin.org',
      },
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      source: 'coincap',
      metadata: {
        description: 'Programmable blockchain',
        website: 'https://ethereum.org',
      },
    },
  ];

  const stockAssets = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stock',
      source: 'iex',
      metadata: {
        sector: 'Technology',
        industry: 'Consumer Electronics',
      },
    },
    {
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      type: 'stock',
      source: 'iex',
      metadata: {
        sector: 'Automotive',
        industry: 'Electric Vehicles',
      },
    },
  ];

  await knex('assets').insert([...cryptoAssets, ...stockAssets]);
}
