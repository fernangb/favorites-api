import { Module } from '@nestjs/common';
import { AuthorizationGuard } from './guard/authorization.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { HashModule } from '../hash/hash.module';
import { TokenModule } from '../token/token.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './stratetgy/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HashModule,
    TokenModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('AUTH_SECRET'),
        signOptions: { expiresIn: config.get('AUTH_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [],
  providers: [AuthorizationGuard, AuthenticationGuard, JwtStrategy],
  exports: [AuthorizationGuard, AuthenticationGuard],
})
export class AuthModule {}
