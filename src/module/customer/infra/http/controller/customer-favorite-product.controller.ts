import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { CustomerFavoriteProductService } from '../../../../../module/customer/application/service/customer-favorite-product.service';
import { AddCustomerFavoriteProductRequest } from '../../../../../module/customer/application/dto/add-customer-favorite-product.dto';
import { FindCustomerFavoriteProductResponse } from 'src/module/customer/application/dto/find-customer-favorite-products.dto';

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

  @Get('/favorites/:id')
  @ApiOperation({ summary: 'Find customer favorite products' })
  @ApiResponse({
    status: 200,
    description: 'Favorite products found',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async findByCustomerId(
    @Param('id') id: string,
  ): Promise<FindCustomerFavoriteProductResponse> {
    return this.service.findByCustomerId(id);
  }
}
