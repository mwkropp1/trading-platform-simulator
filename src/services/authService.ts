import bcrypt from 'bcrypt';
import { getUserByEmail, insertUser, getUserById } from '../repositories/userRepository';
import type { User } from '../repositories/userRepository';
import { signToken } from '../utils/jwt';
import { AuthError } from '../errors';

const SALT_ROUNDS = 12;

export class AuthService {
  static async registerUser(
    username: string,
    email: string,
    password: string,
    role: 'user' | 'admin' = 'user'
  ): Promise<{ user: User; token: string }> {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw AuthError.userExists('email');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const user = await insertUser({
        username,
        email,
        password_hash: hashedPassword,
        role: role,
      });

      const token = this.generateToken(user);
      return { user, token };
    } catch (error) {
      if (error instanceof Error && error.message.includes('unique constraint')) {
        throw AuthError.userExists('username');
      }
      throw error;
    }
  }

  static async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw AuthError.invalidCredentials();
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async getCurrentUser(userId: string): Promise<User> {
    const user = await getUserById(userId);

    if (!user) {
      throw AuthError.unauthorized('User not found');
    }

    return user;
  }

  private static generateToken(user: User): string {
    if (!user.id || !user.role) {
      throw AuthError.unauthorized('Invalid user data for token generation');
    }
    return signToken({ id: user.id, role: user.role });
  }
}
