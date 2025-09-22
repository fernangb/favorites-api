import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { AuthorizationGuard } from '../../../../../module/shared/module/auth/guard/authorization.guard';
import { AuthenticationGuard } from '../../../../../module/shared/module/auth/guard/authentication.guard';
import { LogService } from '../../../../../module/shared/module/log/log.service';
import { LogControllerEnum } from '../../../../../module/shared/enum/log.enum';

@Controller('customers/v1')
@ApiTags('Customers')
export class CustomerController {
  constructor(
    private readonly service: CustomerService,
    @Inject(LogControllerEnum.CUSTOMER)
    private readonly logger: LogService,
  ) {}

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
    try {
      this.logger.log('Find customer by id', id);
      const customer = await this.service.findOneById(id);
      this.logger.log('Customer found', JSON.stringify(customer));

      return customer;
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
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
    try {
      this.logger.log('Update customer', id);
      await this.service.update(id, dto);
      this.logger.log('Customer updated', id);
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
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
    try {
      this.logger.log('Delete customer', id);
      await this.service.delete(id);
      this.logger.log('Customer deleted', id);
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
