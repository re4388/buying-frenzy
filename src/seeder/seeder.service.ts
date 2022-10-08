import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Dish } from '../dish/entities/dish.entity';
import { OpeningHour } from '../opening-hours/entities/opening-hour.entity';
import { User } from '../user/entities/user.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import * as moment from 'moment';

export type restaurantMenu = {
  dishName: string;
  price: number;
};

export type dish = {
  name: string;
  restaurantId: string;
  price: number;
};

export type timeSpan = {
  opens_at: Date;
  closes_at: Date;
  overnight: boolean;
};

export type purchaseHistory = {
  dishName: string;
  restaurantName: string;
  transactionAmount: number;
  transactionDate: string;
};
@Injectable()
export class SeederService {
  constructor(
    private httpService: HttpService,
    private dataSource: DataSource,
  ) { }

  async importData(): Promise<void> {
    await this.importRestaurants();
    this.importUsers();
  }

  async importRestaurants() {
    const response = await firstValueFrom(
      this.httpService.get(process.env.RESTAURANT_DATA_URL),
    );
    if (response.status === 200) {
      const restaurants = response.data;
      if (restaurants.length > 0) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          for (const restaurant of restaurants) {
            const restaurantEntity = new Restaurant();
            restaurantEntity.name = restaurant.restaurantName;
            restaurantEntity.cash_balance = restaurant.cashBalance;
            await queryRunner.manager.save(restaurantEntity);

            if (restaurant.menu) {
              const dishEntities = this.createDishEntities(
                restaurant.menu,
                restaurantEntity,
              );
              await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Dish)
                .values(dishEntities)
                .execute();
            }

            if (restaurant.openingHours) {
              const OpeningHourEntities = this.createOpeningHourEntity(
                restaurant.openingHours,
                restaurantEntity,
              );
              await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(OpeningHour)
                .values(OpeningHourEntities)
                .execute();
            }
          }
          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }
      }
    } else {
      console.log(
        'error at seed restaurant raw data',
        response.statusText,
      );
    }
  }

  async importUsers() {
    const response = await firstValueFrom(
      this.httpService.get(process.env.USER_DATA_URL),
    );
    if (response.status === 200) {
      const users = response.data;
      if (users.length > 0) {
        const dishEntities = await Dish.find();
        const dishesObjects = this.generateObjectsFromEntities(
          dishEntities,
          'name',
        );
        const restaurantEntities = await Restaurant.find();
        const restaurantsObjects = this.generateObjectsFromEntities(
          restaurantEntities,
          'name',
        );
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
          for (const user of users) {
            const userEntity = new User();
            userEntity.name = user.name;
            userEntity.cash_balance = user.cashBalance;
            await queryRunner.manager.save(userEntity);

            if (user.purchaseHistory) {
              const purchaseOrderEntities = this.createPurchaseOrderEntities(
                user.purchaseHistory,
                userEntity,
                restaurantsObjects,
                dishesObjects,
              );
              await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(PurchaseOrder)
                .values(purchaseOrderEntities)
                .execute();
            }
          }
          await queryRunner.commitTransaction();
        } catch (err) {
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }
      }
    } else {
      console.log(
        'error at seed raw user purchasing history data',
        response.statusText,
      );
    }
  }

  generateObjectsFromEntities<T>(entities: T[], key: string): { [name: string]: T } {
    const objects = {};
    entities.map((entity) => {
      objects[entity[key]] = entity;
    });
    return objects;
  }

  createDishEntities(menuItems: restaurantMenu[], restaurantEntity: Restaurant): Dish[] {
    const dishEntities = menuItems.map((item) => {
      const dishEntity = new Dish();
      dishEntity.name = item.dishName;
      dishEntity.price = item.price;
      dishEntity.restaurant = restaurantEntity;
      return dishEntity;
    });
    return dishEntities;
  }

  createOpeningHourEntity(
    openingHour: string,
    restaurant: Restaurant,
  ): OpeningHour[] {

    const days = openingHour.split('/');
    const weekDays = {};

    for (const day of days) {
      const d = day.trim().split(' ');
      const time_string = d.slice(-5).join('').trim();
      const { opens_at, closes_at, overnight } =
        this.parseTimeSpan(time_string);
      const weekday_part = d.slice(0, -5).join('');
      // console.log("weekday_part", weekday_part);
      const groups = weekday_part.split(',');

      // console.log("groups", groups);
      for (const group of groups) {
        if (group.includes('-')) {
          const splittedDays = this.gatDayRange(group);
          // console.log(group, splittedDays);
          splittedDays.forEach((splitDay) => {
            const openingHour = new OpeningHour();
            openingHour.weekday = splitDay;
            openingHour.opens_at = opens_at;
            openingHour.closes_at = closes_at;
            openingHour.overnight = overnight;
            openingHour.restaurant = restaurant;
            weekDays[splitDay] = openingHour;
          });
        } else {
          const weekday = this.parseWeekDayToInt(group);
          const weekdayString = this.parseWeekDayToString(weekday);
          const openingHour = new OpeningHour();
          openingHour.weekday = weekdayString;
          openingHour.opens_at = opens_at;
          openingHour.closes_at = closes_at;
          openingHour.overnight = overnight;
          openingHour.restaurant = restaurant;
          weekDays[weekdayString] = openingHour;
        }
      }
    }
    return Object.values(weekDays);
  }

  gatDayRange(range: string): string[] {
    const [weekday_start, weekday_end] = range.split('-');
    let weekday_start_number = this.parseWeekDayToInt(weekday_start.trim());
    const weekday_end_number = this.parseWeekDayToInt(weekday_end.trim());
    let diff = (weekday_end_number - weekday_start_number) % 7;
    diff = diff < 0 ? 7 + (weekday_end_number - weekday_start_number) : diff;

    const days = [];
    for (let step = 0; step <= diff; step++) {
      days.push(this.parseWeekDayToString(weekday_start_number % 7));
      weekday_start_number = weekday_start_number + 1;
      days.push();
    }
    return days;
  }

  parseWeekDayToInt(day: string): number {
    return {
      MON: 0,
      TUES: 1,
      WEDS: 2,
      WED: 2,
      THU: 3,
      THURS: 3,
      FRI: 4,
      SAT: 5,
      SUN: 6,
    }[day.toUpperCase()];
  }

  parseWeekDayToString(day: number): string {
    return {
      6: 'SUN',
      0: 'MON',
      1: 'TUES',
      2: 'WED',
      3: 'THUS',
      4: 'FRI',
      5: 'SAT',
    }[day];
  }

  parseTimeSpan(timeString: string): timeSpan {
    const [opensAt, closesAt] = timeString.split('-');
    const opensAtDate = this.convertTime12to24(opensAt);
    const closesAtDate = this.convertTime12to24(closesAt);
    const overnight = closesAtDate < opensAtDate;
    return {
      opens_at: opensAtDate,
      closes_at: closesAtDate,
      overnight,
    };
  }

  convertTime12to24 = (time: string): Date => {
    // console.log("convertTime12to24 time", time);
    let hours = parseInt(time.match(/^(\d+)/)[1]);
    const minuteParsed = time.match(/:(\d+)/);
    const minutes = minuteParsed != null ? parseInt(minuteParsed[1]) : 0;
    const AMPM = time.match(/([a-z]+)/)[1];
    if (AMPM.toLocaleLowerCase() == 'pm' && hours < 12) hours = hours + 12;
    if (AMPM.toLocaleLowerCase() == 'am' && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = '0' + sHours;
    if (minutes < 10) sMinutes = '0' + sMinutes;
    return new Date('2022-01-01 ' + sHours + ':' + sMinutes + ':' + '00');
  };

  createPurchaseOrderEntities(
    purchaseHistories: purchaseHistory[],
    user: User,
    restaurants: { [name: string]: Restaurant },
    dishes: { [name: string]: Dish },
  ): PurchaseOrder[] {
    return purchaseHistories.map((purchaseHistory) => {
      const purchaseOrderEntity = new PurchaseOrder();
      purchaseOrderEntity.dish_name = purchaseHistory.dishName;
      purchaseOrderEntity.restaurant_name = purchaseHistory.restaurantName;
      purchaseOrderEntity.restaurant = restaurants[purchaseHistory.restaurantName]
        ? restaurants[purchaseHistory.restaurantName]
        : null;
      purchaseOrderEntity.dish = dishes[purchaseHistory.dishName]
        ? dishes[purchaseHistory.dishName]
        : null;
      purchaseOrderEntity.transaction_date = moment(
        purchaseHistory.transactionDate,
        'MM/DD/YYYY hh:mm A',
      ).toDate();
      purchaseOrderEntity.transaction_amount = purchaseHistory.transactionAmount;
      purchaseOrderEntity.user = user;
      return purchaseOrderEntity;
    });
  }
}
