import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Restaurant } from './entities/restaurant.entity';
import { operationsType, searchType } from '../common/enum/enum';
import { In, Repository } from 'typeorm';
import { OpeningHour } from '../opening-hours/entities/opening-hour.entity';
import { Dish } from '../dish/entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(OpeningHour)
    private OpeningHourRepository: Repository<OpeningHour>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) { }

  async getRestaurantsOpensAt(opensAt: Date): Promise<Restaurant[]> {
    const momentOpensAt = moment(opensAt);
    const day = momentOpensAt.format('ddd'); // ex. Sat
    const OpeningHoursResults =
      await this.OpeningHourRepository.createQueryBuilder()
        .where('weekday = :day', { day })
        .andWhere(
          ' ( (opens_at <= :opens_at AND closes_at >= :opens_at AND overnight = 0 ) OR ( (closes_at >= :opens_at OR opens_at <= :opens_at ) AND overnight = 1 ) )',
          { opens_at: opensAt },
        )
        .select('distinct restaurantId')
        .getRawMany();


    if (OpeningHoursResults.length > 0) {
      const restaurantIds = OpeningHoursResults.map((openingHourRow) => {
        return openingHourRow.restaurantId;
      });

      return this.getRestaurantsByIds(restaurantIds);
    }
    return [];
  }

  async getRestaurantsFilterByPrice(
    fromPrice: number,
    toPrice: number,
    dishes: number,
    operation: operationsType,
  ): Promise<Restaurant[]> {
    let minMaxQueryOperator = '>=';
    if (operation === operationsType.max) {
      minMaxQueryOperator = '<=';
    }
    const restaurantIdResults = await this.dishRepository
      .createQueryBuilder()
      .where('price >= :from_price')
      .andWhere('price <= :to_price')
      .groupBy('restaurantId')
      .having(`count(restaurantId) ${minMaxQueryOperator} :dishes`)
      .setParameters({ from_price: fromPrice, to_price: toPrice, dishes })
      .select('restaurantId')
      .getRawMany();

    if (restaurantIdResults.length > 0) {
      const restaurantIds = restaurantIdResults.map((row) => {
        return row.restaurantId;
      });

      return this.getRestaurantsByIds(restaurantIds);
    }

    return [];
  }

  async getRestaurantsByIds(ids: string[]): Promise<Restaurant[]> {
    return Restaurant.find({
      where: {
        id: In(ids),
      },
      order: {
        name: 'ASC',
      },
      select: ['id', 'name', 'cash_balance'],
    });
  }

  getResultBySearch(
    keyword: string,
    type: searchType,
  ): Promise<Restaurant[] | Dish[]> {
    if (type == searchType.dish) {
      return this.getDishesBySearchName(keyword);
    } else if (type == searchType.restaurant) {
      return this.getRestaurantsBySearchName(keyword);
    }
  }

  getDishesBySearchName(keyword: string): Promise<Dish[]> {
    return this.dishRepository
      .createQueryBuilder()
      .where('name Like :keyword', { keyword: `%${keyword}%` })
      .orderBy(`INSTR(name, '${keyword}' ) `)
      .getRawMany();
  }

  getRestaurantsBySearchName(keyword: string): Promise<Restaurant[]> {
    return this.restaurantRepository
      .createQueryBuilder()
      .where('name Like :keyword', { keyword: `%${keyword}%` })
      .orderBy(`INSTR(name, '${keyword}' ) `)
      .getRawMany();
  }
}
