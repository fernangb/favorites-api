import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../../../application/service/customer.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomerRequest } from '../../../application/dto/create-customer.dto';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { FindCustomerResponse } from '../../../../../module/customer/application/dto/find-customer.dto';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { UpdateCustomerRequest } from '../../../../../module/customer/application/dto/update-customer.dto';
import { AuthorizationGuard } from 'src/module/shared/module/auth/guard/authorization.guard';
import { AuthenticationGuard } from 'src/module/shared/module/auth/guard/authentication.guard';

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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findOneById(@Param('id') id: string): Promise<CustomerEntity> {
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
  async findAll(): Promise<FindCustomerResponse> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Update customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerRequest,
  ): Promise<void> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
