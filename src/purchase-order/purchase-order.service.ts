import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Dish } from '../dish/entities/dish.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import * as moment from 'moment';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private dataSource: DataSource
  ) { }


  async placeOrder(user: User, dish: Dish): Promise<PurchaseOrder | null> {
    // console.log("user", user);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const purchaseOrder = new PurchaseOrder();
    // console.log("purchaseOrder", purchaseOrder);
    purchaseOrder.dish = dish;
    purchaseOrder.user = user;
    purchaseOrder.restaurant = dish.restaurant;
    purchaseOrder.dish_name = dish.name;
    purchaseOrder.restaurant_name = dish.restaurant.name;
    purchaseOrder.transaction_amount = dish.price;
    purchaseOrder.transaction_date = moment().toDate();
    try {
      await queryRunner.manager.save(purchaseOrder);
      await queryRunner.manager.decrement(
        User,
        { id: user.id },
        'cash_balance',
        dish.price,
      );
      await queryRunner.manager.increment(
        Restaurant,
        { id: dish.restaurant.id },
        'cash_balance',
        dish.price,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
      return purchaseOrder;
    }
  }
}
