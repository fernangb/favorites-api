import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IdentityService } from '../../application/service/identity.service';
import { DefaultErrorResponse } from '../../../../module/shared/error/default.error';
import { SignUpRequest } from '../../application/dto/sign-up.dto';
import {
  SignInRequest,
  SignInResponse,
} from '../../application/dto/sign-in.dto';

@Controller('identity')
@ApiTags('Identity')
export class IdentityController {
  constructor(private readonly service: IdentityService) {}

  @Post('sign_up')
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
    return this.service.signUp(dto);
  }

  @Post('/sign_in')
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
