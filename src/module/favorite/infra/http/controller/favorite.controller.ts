import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DefaultErrorResponse } from '../../../../shared/error/default.error';
import { FavoriteService } from '../../../application/service/favorite.service';
import { AddFavoriteRequest } from '../../../application/dto/add-favorite.dto';
import { FindFavoriteResponse } from '../../../application/dto/find-favorite.dto';

@Controller('favorites')
@ApiTags('Favorites')
export class FavoriteController {
  constructor(private readonly service: FavoriteService) {}

  @Post('/customers')
  @ApiOperation({ summary: 'Add a favorite product to customer' })
  @ApiResponse({
    status: 201,
    description: 'Added product',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  async add(@Body() dto: AddFavoriteRequest): Promise<void> {
    await this.service.add(dto);
  }

  @Get('/customers/:id')
  @ApiOperation({ summary: 'Find favorites' })
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
  ): Promise<FindFavoriteResponse> {
    return this.service.findByCustomerId(id);
  }

  @ApiOperation({ summary: 'Delete favorite' })
  @ApiResponse({
    status: 200,
    description: 'Favorite product deleted',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  @Delete('/customers/:customerId/:productId')
  async delete(
    @Param('customerId') customerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.service.delete(customerId, productId);
  }
}
