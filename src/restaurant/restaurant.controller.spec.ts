import { Test } from '@nestjs/testing';
import { operationsType, searchType } from '../common/enum/enum';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService

  const mockResData = [{ a1: 1 }, { a2: 2 }]
  const serviceMock = {
    getRestaurantsOpensAt: jest.fn()
      .mockResolvedValue(mockResData),
    getRestaurantsFilterByPrice: jest.fn()
      .mockResolvedValue(mockResData),
    getResultBySearch: jest.fn()
      .mockResolvedValue(mockResData),
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: serviceMock
        }
      ]

    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    controller = module.get<RestaurantController>(RestaurantController);
  });

  it('Get restaurants which opens at certain time', async () => {
    const getRestaurantsOpensAtSpy = jest.spyOn(service, 'getRestaurantsOpensAt');
    await expect(controller.getRestaurantsController(new Date())).resolves.toEqual(mockResData)
    expect(getRestaurantsOpensAtSpy).toBeCalled()
  });

  it('Fetch restaurants by price range and dishes count', async () => {
    const getRestaurantsFilterByPriceSpy = jest.spyOn(service, 'getRestaurantsFilterByPrice');
    await expect(controller.getRestaurantsFilterByPriceController(1, 10, 1, operationsType.max)).resolves.toEqual(mockResData)
    expect(getRestaurantsFilterByPriceSpy).toBeCalled()
  });

  it('Fetch restaurants or dishes by keyword', async () => {
    const getResultBySearchSpy = jest.spyOn(service, 'getResultBySearch');
    await expect(controller.getResultBySearchController("apple", searchType.dish)).resolves.toEqual(mockResData)
    expect(getResultBySearchSpy).toBeCalled()
  });
})