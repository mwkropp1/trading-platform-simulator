import bcrypt from 'bcrypt';
import { getUserByEmail, insertUser, getUserById } from '../repositories/userRepository';
import type { User } from '../repositories/userRepository';
import { signToken } from '../utils/jwt';

const SALT_ROUNDS = 12;

export class AuthService {
  static async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await insertUser({
      username,
      email,
      password_hash: hashedPassword,
      role: 'user',
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  static async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  static async getCurrentUser(userId: string): Promise<User> {
    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private static generateToken(user: User): string {
    if (!user.id || !user.role) {
      throw new Error('User ID or role is missing');
    }
    return signToken({ id: user.id, role: user.role });
  }
}
