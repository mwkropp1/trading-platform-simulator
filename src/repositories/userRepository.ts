import { DatabaseError, ValidationError } from '../errors';
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
    throw ValidationError.field('Invalid user ID', 'id');
  }

  try {
    const user = await db<User>('users').where({ id }).first();
    return user ?? null;
  } catch (error) {
    console.error('Database error fetching user by id:', error);
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!email?.trim()) {
    throw ValidationError.field('Invalid email', 'email');
  }

  try {
    const user = await db<User>('users').where({ email: email.toLowerCase() }).first();
    return user ?? null;
  } catch (error) {
    console.error('Database error fetching user by email:', error);
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}

export async function insertUser(user: User): Promise<User> {
  // Validation checks
  if (!user.username?.trim()) {
    throw ValidationError.field('Username is required', 'username');
  }

  if (!user.email?.trim()) {
    throw ValidationError.field('Email is required', 'email');
  }

  if (!['user', 'admin'].includes(user.role)) {
    throw ValidationError.field('Invalid role value', 'role');
  }

  try {
    const normalizedUser = {
      ...user,
      email: user.email.toLowerCase(),
    };

    const [insertedUser] = await db<User>('users').insert(normalizedUser).returning('*');

    return insertedUser;
  } catch (error) {
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('duplicate key')) {
      const field = error.message.includes('email') ? 'email' : 'username';
      throw DatabaseError.duplicate(field);
    }

    // Log and throw database errors
    console.error('Database error inserting user:', error);
    throw DatabaseError.queryFailed(error instanceof Error ? error : new Error('Unknown error'));
  }
}
