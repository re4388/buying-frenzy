import { Test } from '@nestjs/testing';
import { DishService } from '../dish/dish.service';
import { RestaurantController } from '../restaurant/restaurant.controller';
import { RestaurantService } from '../restaurant/restaurant.service';
import { UserService } from '../user/user.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';

describe('purchaseOrderService', () => {
  let controller: PurchaseOrderController;

  let purchaseOrderService: PurchaseOrderService
  let userService: UserService
  let dishService: DishService

  const mockResData = [{ a1: 1 }, { a2: 2 }]
  const purchasingOrderServiceMock = {
    placeOrder: jest.fn()
      .mockResolvedValue(mockResData),
  }

  const userServiceMock = {
    getById: jest.fn()
      .mockResolvedValue({
        cash_balance: 222
      }),
  }

  const dishServiceMock = {
    getById: jest.fn()
      .mockResolvedValue({
        price: 123
      }),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PurchaseOrderController],
      providers: [
        {
          provide: PurchaseOrderService,
          useValue: purchasingOrderServiceMock
        },
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: DishService,
          useValue: dishServiceMock
        }
      ]

    }).compile();

    purchaseOrderService = module.get<PurchaseOrderService>(PurchaseOrderService);
    dishService = module.get<DishService>(DishService);
    userService = module.get<UserService>(UserService);
    controller = module.get<PurchaseOrderController>(PurchaseOrderController);
  });

  it('place order', async () => {
    const placeOrderSpy = jest.spyOn(purchaseOrderService, 'placeOrder');
    const getByIdDishSpy = jest.spyOn(dishService, 'getById');
    const getByIdUserSpy = jest.spyOn(userService, 'getById');

    const res = {
      status: () => {
        return {
          send: () => 42
        }
      }
    }

    const createPurchaseOrderDto: CreatePurchaseOrderDto = {
      user_id: 'user name 1',
      dish_id: "dish name 2"
    };
    await controller.placeOrderController(res, createPurchaseOrderDto)
    expect(placeOrderSpy).toBeCalled()
    expect(getByIdDishSpy).toBeCalled()
    expect(getByIdUserSpy).toBeCalled()
  });

})