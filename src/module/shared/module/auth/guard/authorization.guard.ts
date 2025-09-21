import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const customer = request.customer;

    if (!customer) {
      throw new ForbiddenException('User not authenticated');
    }

    const paramId = request.params.id;

    if (String(customer.customerId) !== String(paramId)) {
      throw new ForbiddenException(
        'You are not authorized to access this content',
      );
    }

    return true;
  }
}
