import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { operationsType, searchType } from '../common/enum/enum';
import { Dish } from '../dish/entities/dish.entity';
import { OpeningHour } from '../opening-hours/entities/opening-hour.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';


describe('RestaurantService', () => {
  let service: RestaurantService;

  const repoRestaurant = createMock<Repository<Restaurant>>();
  const repoOpeningHour = createMock<Repository<OpeningHour>>();
  const repoDish = createMock<Repository<Dish>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useValue: repoRestaurant
        },
        {
          provide: getRepositoryToken(OpeningHour),
          useValue: repoOpeningHour
        },
        {
          provide: getRepositoryToken(Dish),
          useValue: repoDish
        },

      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getResultBySearch, type is dish', async () => {
    const repoSpy = jest.spyOn(repoDish, 'createQueryBuilder')
    await service.getResultBySearch('dish name 1', searchType.dish)
    expect(repoSpy).toBeCalled()
  });

  it('getResultBySearch, type is restaurant', async () => {
    const repoSpy = jest.spyOn(repoRestaurant, 'createQueryBuilder')
    await service.getResultBySearch('apple', searchType.restaurant)
    expect(repoSpy).toBeCalled()
  });

  it('getRestaurantsFilterByPrice works', async () => {
    const repoSpy = jest.spyOn(repoDish, 'createQueryBuilder')
    await service.getRestaurantsFilterByPrice(0, 300, 1, operationsType.min)
    expect(repoSpy).toBeCalled()
  });

  it('getRestaurantsOpensAt works', async () => {
    const repoSpy = jest.spyOn(repoOpeningHour, 'createQueryBuilder')
    await service.getRestaurantsOpensAt(new Date())
    expect(repoSpy).toBeCalled()
  });
});