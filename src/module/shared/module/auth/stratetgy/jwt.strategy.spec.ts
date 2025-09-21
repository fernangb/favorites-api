import { JwtStrategy } from './jwt.strategy';
import { AuthConfig } from '../../../../../module/identity/config/auth.config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    jest.spyOn(AuthConfig, 'getJWT').mockReturnValue({
      secret: 'test-secret',
      expiresIn: '1h',
    } as any);

    strategy = new JwtStrategy();
  });

  describe('validate', () => {
    it('should not validate', async () => {
      const payload = {};

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        customerId: undefined,
        email: undefined,
      });
    });

    it('should validate', async () => {
      const payload = { sub: '123', email: 'johndoe@email.com' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        customerId: '123',
        email: 'johndoe@email.com',
      });
    });
  });
});
