import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { AuthenticationGuard } from '../../../../shared/module/auth/guard/authentication.guard';
import { AuthorizationGuard } from '../../../../shared/module/auth/guard/authorization.guard';
import { LogService } from '../../../../shared/module/log/log.service';
import { LogControllerEnum } from '../../../../shared/enum/log.enum';

@Controller('favorites/v1')
@ApiTags('Favorites')
export class FavoriteController {
  constructor(
    private readonly service: FavoriteService,
    @Inject(LogControllerEnum.FAVORITE)
    private readonly logger: LogService,
  ) {
    this.service = service;
    this.logger.setContext(FavoriteController.name);
  }

  @Post('/customers/:id')
  @ApiOperation({ summary: 'Add a favorite product to customer' })
  @ApiResponse({
    status: 201,
    description: 'Added product',
  })
  @ApiBadRequestResponse({
    description: 'Some data is invalid',
    type: DefaultErrorResponse,
  })
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async add(
    @Param('id') id: string,
    @Body() dto: AddFavoriteRequest,
  ): Promise<void> {
    try {
      const data = {
        customerId: id,
        productId: dto.productId,
      };
      this.logger.log('Add product to customer favorites list', data);
      await this.service.add(id, dto);
      this.logger.log('Product added to customer favorites', data);
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async findByCustomerId(
    @Param('id') id: string,
  ): Promise<FindFavoriteResponse> {
    try {
      this.logger.log('Find customer favorites products', id);
      const favorites = await this.service.findByCustomerId(id);
      this.logger.log('Favorites found', favorites);

      return favorites;
    } catch (error) {
      this.logger.error('Error', error.message);
      DefaultErrorResponse.getMessage({
        message: error.message,
        statusCode: error.status,
        error: error.name,
      });
    }
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete('/customers/:id/:productId')
  async delete(
    @Param('id') customerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    try {
      const data = {
        customerId,
        productId,
      };
      this.logger.log('Delete customer favorite product', data);
      await this.service.delete(customerId, productId);
      this.logger.log('Product deleted from customer favorites', data);
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
