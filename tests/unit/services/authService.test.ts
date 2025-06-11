import { AuthService } from '../../../src/services/authService';
import { getUserByEmail, insertUser } from '../../../src/repositories/userRepository';
import { signToken } from '../../../src/utils/jwt';
import bcrypt from 'bcrypt';

jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/utils/jwt');
jest.mock('bcrypt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedPassword123',
        role: 'user',
      };
      const mockToken = 'jwt.token.here';

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      (insertUser as jest.Mock).mockResolvedValue(mockUser);
      (signToken as jest.Mock).mockReturnValue(mockToken);

      const result = await AuthService.registerUser('testuser', 'test@example.com', 'password123');

      expect(result).toEqual({ user: mockUser, token: mockToken });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(insertUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedPassword123',
        role: 'user',
      });
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password_hash: 'hashedPassword123',
        role: 'user',
      };
      const mockToken = 'jwt.token.here';

      (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (signToken as jest.Mock).mockReturnValue(mockToken);

      const result = await AuthService.loginUser('test@example.com', 'password123');

      expect(result).toEqual({ user: mockUser, token: mockToken });
      expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    });

    it('should throw error with invalid credentials', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.loginUser('wrong@example.com', 'wrongpass')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});
