import { randomUUID } from 'crypto';
import { getUserById, insertUser, User } from '../../../src/repositories/userRepository';
import '../../helpers/dbTestSetup';

describe('UserRepository Integration Tests', () => {
  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      const result = await getUserById(randomUUID());
      expect(result).toBeNull();
    });

    it('should return user when found', async () => {
      const newUser = await insertUser({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user',
      });

      expect(newUser.id).toBeDefined();

      const result = await getUserById(newUser.id!);
      expect(result).not.toBeNull();

      if (!result) {
        throw new Error('User not found');
      }

      expect(result).toMatchObject({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        cash_balance: '100000.00',
        role: 'user',
      });
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('insertUser', () => {
    it('should create new user successfully', async () => {
      const user: User = {
        username: 'newuser',
        email: 'new@example.com',
        password_hash: 'hashed_password_here',
        role: 'user',
      };

      const result = await insertUser(user);
      expect(result).toMatchObject(user);
      expect(result.id).toBeDefined();
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it('should prevent duplicate usernames', async () => {
      const user: User = {
        username: 'duplicate',
        email: 'first@example.com',
        password_hash: 'hashed_password_here',
        role: 'user',
      };

      await insertUser(user);
      await expect(
        insertUser({
          ...user,
          email: 'first@example.com',
        })
      ).rejects.toThrow('Username or email already exists');
    });
  });
});
