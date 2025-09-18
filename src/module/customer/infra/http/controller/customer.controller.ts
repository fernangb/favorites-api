import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from '../../../application/service/customer.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomerRequest } from '../../../application/dto/create-customer.dto';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';

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

  @Get(':id')
  @ApiOperation({ summary: 'Find customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async findOneById(@Param('id') id: string) {
    return this.service.findOneById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find customers' })
  @ApiResponse({
    status: 200,
    description: 'Customers found',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async find() {
    return this.service.find();
  }
}
