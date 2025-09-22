import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdentityAuthService } from '../../application/service/identity.auth.service';
import { DefaultErrorResponse } from '../../../../module/shared/error/default.error';
import { SignUpRequest } from '../../application/dto/sign-up.dto';
import {
  SignInRequest,
  SignInResponse,
} from '../../application/dto/sign-in.dto';
import { LogService } from '../../../../module/shared/module/log/log.service';
import { LogControllerEnum } from '../../../../module/shared/enum/log.enum';

@Controller('identity/v1')
@ApiTags('Identity')
export class IdentityController {
  constructor(
    private readonly service: IdentityAuthService,
    @Inject(LogControllerEnum.IDENTITY)
    private readonly logger: LogService,
  ) {}

  @Post('signUp')
  @ApiOperation({ summary: 'Create customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async signUp(@Body() dto: SignUpRequest) {
    try {
      this.logger.log('Sign up customer', dto.email);

      await this.service.signUp(dto);

      this.logger.log('Customer registered');
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
  }

  @Post('/signIn')
  @ApiOperation({ summary: 'Sign in into the API' })
  @ApiResponse({
    status: 201,
    description: 'Sign in response',
    type: SignInResponse,
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async signIn(@Body() dto: SignInRequest): Promise<SignInResponse> {
    try {
      this.logger.log('Sign up customer', dto.email);

      const response = await this.service.signIn(dto);

      this.logger.log('Custmoer signed in', dto.email);

      return response;
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
  }
}
