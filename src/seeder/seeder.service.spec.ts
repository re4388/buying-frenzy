import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { Dish } from '../dish/entities/dish.entity';
import { OpeningHour } from '../opening-hours/entities/opening-hour.entity';
import { PurchaseOrder } from '../purchase-order/entities/purchase-order.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../user/entities/user.entity';
import { SeederService } from './seeder.service';

const restaurantName1 = 'dummy restaurant name 123'
const restaurantName2 = 'dummy restaurant name 456'

const oneRestaurant = new Restaurant()
oneRestaurant.id = '123'
oneRestaurant.name = restaurantName1
oneRestaurant.cash_balance = 123
const secondRestaurant = new Restaurant()
secondRestaurant.id = '456'
secondRestaurant.name = restaurantName2
secondRestaurant.cash_balance = 123
const restaurantArray = [oneRestaurant, secondRestaurant]

const menus = [
  {
    dishName: "apple pie",
    price: 22,
  },
  {
    dishName: "banana pie",
    price: 23,
  }
]

const openingHoursArr = [
  "Mon, Fri 2:30 pm - 8 pm / Tues 11 am - 2 pm / Weds 1:15 pm - 3:15 am / Thurs 10 am - 3:15 am / Sat 5 am - 11:30 am / Sun 10:45 am - 5 pm",
  "Mon, Weds 3:45 pm - 5 pm / Tues 11:30 am - 3 am / Thurs 10 am - 11:30 pm / Fri 7 am - 9:45 am / Sat 12:45 pm - 1:15 pm / Sun 2 pm - 7 pm",
  "Mon - Tues, Thurs 8:30 am - 2:45 am / Weds, Fri 4 pm - 11:15 pm / Sat 6:15 am - 6:45 pm / Sun 5 pm - 12:30 am"
]


const testUser1 = 'fake user name';
const oneUser = new User();
oneUser.name = testUser1
oneUser.cash_balance = 123

const oneDish = new Dish();
oneDish.name = menus[0].dishName
oneDish.price = menus[0].price
oneDish.restaurant = oneRestaurant

const secondDish = new Dish();
secondDish.name = menus[1].dishName
secondDish.price = menus[1].price
secondDish.restaurant = oneRestaurant

const dishArray = [oneDish, secondDish]

let date = new Date(1481361366000);


const purchaseHistoryArr = [
  {
    dishName: menus[0].dishName,
    restaurantName: restaurantName1,
    transactionAmount: 22,
    transactionDate: "02/10/2020 04:09 AM"
  },
  {
    dishName: menus[1].dishName,
    restaurantName: restaurantName2,
    transactionAmount: 33,
    transactionDate: "02/10/2020 04:09 AM"
  }
]

const purchaseOrder = new PurchaseOrder();
purchaseOrder.dish = oneDish;
purchaseOrder.user = oneUser;
purchaseOrder.restaurant = oneDish.restaurant;
purchaseOrder.dish_name = oneDish.name;
purchaseOrder.restaurant_name = oneDish.restaurant.name;
purchaseOrder.transaction_amount = oneDish.price;
// purchaseOrder.transaction_date = moment().toDate();
purchaseOrder.transaction_date = new Date("2020-02-09T20:09:00.000Z");




const openingHour = new OpeningHour()
openingHour.weekday = 'SUN'
openingHour.opens_at = date
openingHour.closes_at = date
openingHour.overnight = false
openingHour.restaurant = oneRestaurant

const openingHour2 = new OpeningHour()
openingHour2.weekday = 'MON'
openingHour2.opens_at = new Date("2022-01-01T00:30:00.000Z")
openingHour2.closes_at = new Date("2021-12-31T18:45:00.000Z")
openingHour2.overnight = true
openingHour2.restaurant = oneRestaurant

const openingHour3 = new OpeningHour()
openingHour3.weekday = 'MON'
openingHour3.opens_at = new Date("2022-01-01T06:30:00.000Z")
openingHour3.closes_at = new Date("2022-01-01T12:00:00.000Z")
openingHour3.overnight = false
openingHour3.restaurant = oneRestaurant
// const openingHourArray = [openingHour, openingHour2, openingHour3]




const createQueryRunner: any = {
  connect: () => createQueryRunner,
  startTransaction: () => createQueryRunner,
  commitTransaction: () => createQueryRunner,
  rollbackTransaction: () => createQueryRunner,
  release: () => createQueryRunner,
  manager: jest.fn().mockImplementation(
    () => {
      save: jest.fn()
      decrement: jest.fn()
      increment: jest.fn()
    })
}


const dataSourceMethodMock = {
  createQueryRunner: jest.fn().mockImplementation(
    () => createQueryRunner
  )
}



const observableRestaurant = new Observable((subscriber) => {
  subscriber.next({
    status: 200,
    data: [
      {
        restaurantName: 'name1',
        cashBalance: 123,
        menu: menus[0],
        openingHours: openingHoursArr[0]
      },
      {
        restaurantName: 'name2',
        cashBalance: 456,
        menu: menus[1],
        openingHours: openingHoursArr[1]
      }
    ]
  })
});

const observableUser = new Observable((subscriber) => {
  subscriber.next({
    status: 200,
    data: [
      {
        name: 'userName1',
        cashBalance: 123,
        purchaseHistory: [
          {
            dishName: "apple pie",
            restaurantName: 'name1',
            transactionAmount: 123,

          }
        ]
      },
      {
        name: 'userName2',
        cashBalance: 456,
        purchaseHistory: [
          {
            dishName: "banana pie",
            restaurantName: 'name2',
            transactionAmount: 123,

          }
        ]
      }
    ]
  })
});

const httpServiceMethodMock = {
  get: jest.fn()
    .mockImplementationOnce(
      () => observableRestaurant
    )
    .mockImplementationOnce(
      () => observableUser
    )
}

const restaurantMethodMock = {
  find: jest.fn().mockResolvedValue(restaurantArray),
  // findOneBy: jest.fn().mockResolvedValue(oneRestaurant),
  // createQueryBuilder: jest.fn().mockImplementation(
  //   () => restaurantSearch
  // )
}

const openingHourMethodMock = {
  // createQueryBuilder: jest.fn()
  //   .mockImplementation(
  //     () => OpenAtBuilder
  //   )
}


const dishMethodMock = {
  find: jest.fn().mockResolvedValueOnce(dishArray),
  // createQueryBuilder: jest.fn()
  //   .mockImplementationOnce(
  //     () => dishSearch
  //   )
  //   .mockImplementationOnce(
  //     () => filterPriceBuilder
  //   )
}

describe('SeederService', () => {
  let service: SeederService;
  let dataSource: DataSource
  let httpService: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: DataSource,
          useValue: dataSourceMethodMock
        },
        {
          provide: HttpService,
          useValue: httpServiceMethodMock
        },
        {
          provide: getRepositoryToken(Restaurant),
          useValue: restaurantMethodMock
        },
        {
          provide: getRepositoryToken(OpeningHour),
          useValue: openingHourMethodMock
        },
        {
          provide: getRepositoryToken(Dish),
          useValue: dishMethodMock
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    dataSource = module.get<DataSource>(DataSource);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  // TODO: fix UnhandledPromiseRejectionWarning: Error: DataSource is not set for this entity
  it('dataSource run transaction', async () => {
    const getSpy = jest.spyOn(httpService, 'get');
    // const dataSourceSpy = jest.spyOn(dataSource, 'createQueryRunner');
    await service.importData()
    // expect(dataSourceSpy).toBeCalled()
    expect(getSpy).toBeCalled()
  });

  it('generateObjectsFromEntities work ', () => {
    const res = service.generateObjectsFromEntities(dishArray, 'name')
    const expectedObj = {
      "apple pie": oneDish,
      "banana pie": secondDish
    }
    expect(res).toStrictEqual(expectedObj)
  });

  it('createDishEntities work ', () => {
    const res = service.createDishEntities(menus, oneRestaurant)
    expect(res).toStrictEqual(dishArray)
  });

  it('createOpeningHourEntity work ', () => {
    const res1 = service.createOpeningHourEntity(openingHoursArr[0], oneRestaurant)
    const res2 = service.createOpeningHourEntity(openingHoursArr[2], oneRestaurant)
    expect(res1[0]).toStrictEqual(openingHour3)
    expect(res2[0]).toStrictEqual(openingHour2)
  });

  it('createPurchaseOrderEntities work ', () => {
    const dishObj = service.generateObjectsFromEntities(dishArray, 'name')
    const resObj = service.generateObjectsFromEntities(restaurantArray, 'name')
    const res = service.createPurchaseOrderEntities(
      purchaseHistoryArr,
      oneUser,
      resObj,
      dishObj
    )
    expect(res[0]).toStrictEqual(purchaseOrder)
  });







});