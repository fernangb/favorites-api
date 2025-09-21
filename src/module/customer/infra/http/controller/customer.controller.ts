import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { CustomerEntity } from '../../../../../module/customer/domain/entity/customer.entity';
import { UpdateCustomerRequest } from '../../../../../module/customer/application/dto/update-customer.dto';
import { AuthorizationGuard } from 'src/module/shared/module/auth/guard/authorization.guard';
import { AuthenticationGuard } from 'src/module/shared/module/auth/guard/authentication.guard';

@Controller('customers')
@ApiTags('Customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

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

  @ApiOperation({ summary: 'Update customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
