import { Request, Response } from 'express';
import { AuthController } from '../../../src/controllers/authController';
import { AuthService } from '../../../src/services/authService';
import { RegisterSchema } from '../../../src/schemas/authSchemas';
import { UserResponseSchema } from '../../../src/schemas/userSchemas';
import { z } from 'zod';

jest.mock('../../../src/services/authService');
jest.mock('../../../src/schemas/authSchemas');
jest.mock('../../../src/schemas/userSchemas');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockRequest = { body: {} };
    mockResponse = { status: mockStatus, json: mockJson };
  });

  describe('register', () => {
    it('should return 201 with user and token on successful registration', async () => {
      const mockUser = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      };
      const mockToken = 'jwt.token.here';

      mockRequest.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      (RegisterSchema.parse as jest.Mock).mockReturnValue(mockRequest.body);
      (UserResponseSchema.parse as jest.Mock).mockReturnValue(mockUser);
      (AuthService.registerUser as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(RegisterSchema.parse).toHaveBeenCalledWith(mockRequest.body);
      expect(AuthService.registerUser).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'Password123'
      );
      expect(UserResponseSchema.parse).toHaveBeenCalledWith(mockUser);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ user: mockUser, token: mockToken });
    });

    it('should return 400 when validation fails', async () => {
      mockRequest.body = {
        username: 't',
        email: 'invalid',
      };

      (RegisterSchema.parse as jest.Mock).mockImplementation(() => {
        throw new z.ZodError([{ code: 'custom', message: 'Invalid input', path: ['username'] }]);
      });

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: expect.any(Array) });
    });

    it('should return 500 when service throws unexpected error', async () => {
      mockRequest.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      (RegisterSchema.parse as jest.Mock).mockReturnValue(mockRequest.body);
      (AuthService.registerUser as jest.Mock).mockRejectedValue(new Error('Database error'));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
