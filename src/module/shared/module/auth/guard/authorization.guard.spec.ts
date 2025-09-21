import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;

  beforeEach(() => {
    guard = new AuthorizationGuard();
  });

  describe('canActivate', () => {
    it('should throw ForbiddenException if is no customer in request', () => {
      const request = { params: { id: '123' } };
      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException('User not authenticated'),
      );
    });

    it('should throw ForbiddenException if params not matches', () => {
      const customer = { customerId: '123' };
      const request = { customer, params: { id: '456' } };
      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException('You are not authorized to access this content'),
      );
    });

    it('should return true if params macthes', () => {
      const customer = { customerId: '123' };
      const request = { customer, params: { id: '123' } };
      const context = {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });
  });
});
