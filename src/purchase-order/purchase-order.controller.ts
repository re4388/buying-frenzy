import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { DishService } from '../dish/dish.service';

@Controller('/v1/purchase-order')
export class PurchaseOrderController {
  constructor(
    private readonly userService: UserService,
    private readonly dishService: DishService,
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

  @Post()
  @ApiNotFoundResponse({ description: 'If user or dish not exist!' })
  @ApiBadRequestResponse({ description: 'You have insufficient balance!' })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong while place order!',
  })
  @ApiOkResponse({ description: 'If place order successfully! return object' })
  async placeOrderController(
    @Res() res,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ) {
    const user = await this.userService.getById(createPurchaseOrderDto.user_id);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send('User does not exist!');
    }

    const dish = await this.dishService.getById(createPurchaseOrderDto.dish_id);
    if (!dish) {
      return res.status(HttpStatus.NOT_FOUND).send('Dish does not exist!');
    }

    if (dish.price > user.cash_balance) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('You have insufficient balance!');
    }
    const purchaseOrder = await this.purchaseOrderService.placeOrder(
      user,
      dish,
    );
    if (!purchaseOrder) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Something went wrong while place order!');
    }

    return res.status(HttpStatus.OK).send({
      id: purchaseOrder.id,
      dish_name: purchaseOrder.dish_name,
      transaction_amount: purchaseOrder.transaction_amount,
      transaction_date: purchaseOrder.transaction_date,
      restaurant_name: purchaseOrder.restaurant_name,
    });
  }
}
