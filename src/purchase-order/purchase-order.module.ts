import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { UserModule } from '../user/user.module';
import { DishModule } from '../dish/dish.module';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder]), UserModule, DishModule],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  exports: [TypeOrmModule],
})
export class PurchaseOrderModule {}
