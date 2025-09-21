import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsObject, IsString } from 'class-validator';
import { CustomerEntity } from '../../../../module/customer/domain/entity/customer.entity';

export class SignInRequest {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  password: string;
}

export class SignInResponse {
  @ApiProperty()
  @IsObject()
  customer: CustomerEntity;

  @ApiProperty({ example: 'fake-token' })
  @IsString()
  token: string;
}
