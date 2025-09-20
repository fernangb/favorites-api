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
    description: 'It happens when some data is invalid',
    type: DefaultErrorResponse,
  })
  async login(@Body() dto: SignUpRequest) {
    return this.service.signUp(dto);
  }
}
