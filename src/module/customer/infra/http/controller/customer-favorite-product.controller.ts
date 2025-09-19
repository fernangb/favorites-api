import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { CustomerFavoriteProductService } from '../../../../../module/customer/application/service/customer-favorite-product.service';
import { AddCustomerFavoriteProductRequest } from '../../../../../module/customer/application/dto/add-customer-favorite-product.dto';

@Controller('customers')
@ApiTags('Customers')
export class CustomerFavoriteProductController {
  constructor(private readonly service: CustomerFavoriteProductService) {}

  @Post('/favorites')
  @ApiOperation({ summary: 'Add a favorite product to customer' })
  @ApiResponse({
    status: 201,
    description: 'Added product',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async add(@Body() dto: AddCustomerFavoriteProductRequest): Promise<void> {
    await this.service.add(dto);
  }
}
