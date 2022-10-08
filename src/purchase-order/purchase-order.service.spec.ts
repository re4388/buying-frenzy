import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DataSource, Repository } from 'typeorm';
import { Dish } from '../dish/entities/dish.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../user/entities/user.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderService } from './purchase-order.service';

const restaurant = new Restaurant()
restaurant.name = 'dummy restaurant name'
restaurant.cash_balance = 123

const testUser1 = 'fake user name';
const oneUser = new User();
oneUser.name = testUser1
oneUser.cash_balance = 123

const oneDish = new Dish();
oneDish.name = "apple pie"
oneDish.price = 123
oneDish.restaurant = restaurant

const secondDish = new Dish();
secondDish.name = "banana pie"
secondDish.price = 123
secondDish.restaurant = restaurant

const dishArray = [oneDish, secondDish]

const purchaseOrder = new PurchaseOrder();
purchaseOrder.dish = oneDish;
purchaseOrder.user = oneUser;
purchaseOrder.restaurant = oneDish.restaurant;
purchaseOrder.dish_name = oneDish.name;
purchaseOrder.restaurant_name = oneDish.restaurant.name;
purchaseOrder.transaction_amount = oneDish.price;
purchaseOrder.transaction_date = moment().toDate();



const createQueryRunner: any = {
  connect: () => createQueryRunner,
  startTransaction: () => createQueryRunner,
  commitTransaction: () => createQueryRunner,
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

describe('PurchaseOrderService', () => {
  let service: PurchaseOrderService;
  let dataSource: DataSource

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderService,
        {
          provide: DataSource,
          useValue: dataSourceMethodMock
        },
      ],
    }).compile();

    service = module.get<PurchaseOrderService>(PurchaseOrderService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('dataSource run transaction', async () => {
    const createQueryRunnerSpy = jest.spyOn(dataSource, 'createQueryRunner');
    await service.placeOrder(oneUser, oneDish)
    expect(createQueryRunnerSpy).toBeCalled()
  });

});