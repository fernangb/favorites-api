import { Module } from '@nestjs/common';

import { AuthorizationGuard } from './guard/authorization.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { HashModule } from '../hash/hash.module';
import { TokenModule } from '../token/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratetgy/jwt.strategy';

@Module({
  imports: [
    HashModule,
    TokenModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [],
  providers: [AuthorizationGuard, AuthenticationGuard, JwtStrategy],
  exports: [AuthorizationGuard, AuthenticationGuard],
})
export class AuthModule {}
