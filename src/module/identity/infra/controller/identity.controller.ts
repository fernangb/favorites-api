import { Body, Controller, Post } from '@nestjs/common';
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

@Controller('identity')
@ApiTags('Identity')
export class IdentityController {
  constructor(private readonly service: IdentityAuthService) {}

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
    await this.service.signUp(dto);
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
  async signIn(@Body() authDto: SignInRequest): Promise<SignInResponse> {
    return this.service.signIn(authDto);
  }
}
