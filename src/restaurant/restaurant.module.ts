import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DishModule } from '../dish/dish.module';
import { OpeningHoursModule } from '../opening-hours/opening-hours.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Restaurant]),
    OpeningHoursModule,
    DishModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
