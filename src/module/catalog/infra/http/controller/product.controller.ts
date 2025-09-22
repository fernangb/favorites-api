import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
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
import { LogService } from '../../../../../module/shared/module/log/log.service';
import { LogControllerEnum } from '../../../../../module/shared/enum/log.enum';

@Controller('catalog/v1/products/')
@ApiTags('Products')
export class ProductController {
  constructor(
    private readonly service: ProductService,
    @Inject(LogControllerEnum.PRODUCT)
    private readonly logger: LogService,
  ) {}

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
    try {
      this.logger.log('Find product by id', id);
      const product = await this.service.findOneById(id);
      this.logger.log('Product found', product);

      return product;
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
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
  async find(@Query() query: FindProductRequest): Promise<FindProductResponse> {
    try {
      const { page, limit } = query;

      this.logger.log('Find products', query);
      const products = await this.service.find(page, limit);
      this.logger.log('Product found', JSON.stringify(products));

      return products;
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
