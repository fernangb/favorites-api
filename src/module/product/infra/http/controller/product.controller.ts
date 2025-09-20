import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from '../../../application/service/product.service';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { FindProductByIdResponse } from '../../../application/dto/find-product-by-id.dto';
import {
  FindProductRequest,
  FindProductResponse,
} from '../../../application/dto/find-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find product by id' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async findOneById(@Param('id') id: string): Promise<FindProductByIdResponse> {
    return this.service.findOneById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find products' })
  @ApiResponse({
    status: 200,
    description: 'Products found',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async find(
    @Query() query: FindProductRequest,
  ): Promise<FindProductResponse[]> {
    const { page, limit } = query;
    const a = await this.service.find(page, limit);
    console.log(a);
    return a;
  }
}
