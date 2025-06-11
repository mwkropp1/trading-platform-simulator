import db from '../db';

export interface User {
  id?: string;
  username: string;
  email: string;
  password_hash: string;
  cash_balance?: number;
  role: 'user' | 'admin';
  created_at?: Date;
  updated_at?: Date;
}

export async function getUserById(id: string): Promise<User | null> {
  if (!id.trim()) {
    return null;
  }

  try {
    const user = await db<User>('users').where({ id }).first();
    return user ?? null;
  } catch (error) {
    console.error('Database error fetching user by id: ', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email?.trim()) {
    return null;
  }

  try {
    const user = await db<User>('users').where({ email: email.toLowerCase() }).first();
    return user ?? null;
  } catch (error) {
    console.error('Database error fetching user by email: ', error);
    throw error;
  }
}

export async function insertUser(user: User): Promise<User> {
  if (!user.username?.trim() || !user.email?.trim()) {
    throw new Error('Username and email are required');
  }

  if (!['user', 'admin'].includes(user.role)) {
    throw new Error('Invalid role');
  }

  try {
    const normalizedUser = {
      ...user,
      email: user.email.toLowerCase(),
    };

    const [insertedUser] = await db<User>('users').insert(normalizedUser).returning('*');

    return insertedUser;
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('Username or email already exists');
    }

    console.error('Database error inserting user: ', error);
    throw error;
  }
}
