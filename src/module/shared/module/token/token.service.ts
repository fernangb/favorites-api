import { BadRequestException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { AuthConfig } from '../../../../module/identity/config/auth.config';

export default class TokenService {
  validate(token: string): boolean {
    if (!token) throw new BadRequestException('Invalid token');

    const jwt = AuthConfig.getJWT();

    try {
      const decoded = verify(token, jwt.secret);

      if (!decoded) throw new BadRequestException('Invalid token');
      return true;
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  create(userId: string): string {
    const { secret, expiresIn } = AuthConfig.getJWT();

    return sign({}, secret, {
      subject: userId,
      expiresIn,
    });
  }
}
