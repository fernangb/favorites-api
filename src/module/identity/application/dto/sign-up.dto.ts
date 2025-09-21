import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateCustomerRequest } from '../../../../module/customer/application/dto/create-customer.dto';

export class SignUpRequest extends CreateCustomerRequest {
  @ApiProperty()
  @IsString()
  password: string;
}
