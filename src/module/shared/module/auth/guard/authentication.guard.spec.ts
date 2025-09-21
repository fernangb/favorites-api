import { ExecutionContext } from '@nestjs/common';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  beforeEach(() => {
    guard = new AuthenticationGuard();
  });

  describe('handleRequest', () => {
    it('should authenticate customer', () => {
      const customer = { id: '123', name: 'John Doe' };
      const request = { customer: null };
      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;

      const result = guard.handleRequest(null, customer, null, context);

      expect(result).toBe(customer);
      expect(request.customer).toBe(customer);
    });

    it('should throw an error if customer is null', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.handleRequest(null, null, null, context)).toThrow(
        'User not authenticated',
      );
    });

    it('should throw an error if is provided', () => {
      const error = new Error('Fake error');
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.handleRequest(error, null, null, context)).toThrow(
        'Fake error',
      );
    });
  });
});
