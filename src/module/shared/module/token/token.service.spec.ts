import { BadRequestException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import TokenService from './token.service';
import { AuthConfig } from '../../../../module/identity/config/auth.config';

jest.mock('jsonwebtoken');
jest.mock('../../../../module/identity/config/auth.config');

describe('TokenService', () => {
  let provider: TokenService;

  beforeEach(() => {
    provider = new TokenService();

    (AuthConfig.getJWT as jest.Mock).mockReturnValue({
      secret: 'test-secret',
      expiresIn: '1h',
    });
  });

  describe('create', () => {
    it('should return a token', () => {
      (sign as jest.Mock).mockReturnValue('signed-token');

      const token = provider.create('customer-1');

      expect(sign).toHaveBeenCalledWith({}, 'test-secret', {
        subject: 'customer-1',
        expiresIn: '1h',
      });
      expect(token).toBe('signed-token');
    });
  });

  describe('validate', () => {
    it('should return true for a valid token', () => {
      (verify as jest.Mock).mockReturnValue({ sub: 'customer-1' });

      const result = provider.validate('valid-token');

      expect(verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(result).toBe(true);
    });

    it('should throw BadRequestException if token is empty', () => {
      expect(() => provider.validate(null)).toThrow(BadRequestException);
      expect(() => provider.validate(undefined)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException if verify returns falsy', () => {
      (verify as jest.Mock).mockReturnValue(null);

      expect(() => provider.validate('invalid-token')).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if verify throws an error', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new BadRequestException('verify error');
      });

      expect(() => provider.validate('invalid-token')).toThrow(
        BadRequestException,
      );
    });
  });
});
