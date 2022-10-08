import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { DishController } from './dish.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  exports: [TypeOrmModule, DishService],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule { }
