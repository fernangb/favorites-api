import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from '../../application/service/customer.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomerRequest } from '../../application/dto/create-customer.dto';
import { DefaultErrorResponse } from '../../../../module/shared/error/default.error';

@Controller('customers')
@ApiTags('Customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({
    status: 201,
    description: 'Created customer',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async create(
    @Body() createCustomerDTO: CreateCustomerRequest,
  ): Promise<void> {
    await this.service.create(createCustomerDTO);
  }
}
