import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    const request = context.switchToHttp().getRequest();

    if (!user) {
      throw err || new Error('User not authenticated');
    }

    request.customer = user;
    return user;
  }
}
