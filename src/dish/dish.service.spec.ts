import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

const restaurant = new Restaurant()
restaurant.name = 'dummy restaurant name'
restaurant.cash_balance = 123

const oneDish = new Dish();
oneDish.name = "apple pie"
oneDish.price = 123
oneDish.restaurant = restaurant

const secondDish = new Dish();
secondDish.name = "banana pie"
secondDish.price = 123
secondDish.restaurant = restaurant

const dishArray = [oneDish, secondDish]



const createQueryBuilder: any = {
  orderBy: () => createQueryBuilder,
  where: () => createQueryBuilder,
  getRawMany: () => Promise.resolve(dishArray),
};

describe('DishService', () => {
  let service: DishService;
  let repo: Repository<Dish>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DishService,
        {
          provide: getRepositoryToken(Dish),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(oneDish),
            createQueryBuilder: jest.fn().mockImplementation(
              () => createQueryBuilder
            )
          },
        },
      ],
    }).compile();

    service = module.get<DishService>(DishService);
    repo = module.get<Repository<Dish>>(getRepositoryToken(Dish));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('getById should get a one dish', () => {
    const repoSpy = jest.spyOn(repo, 'findOneBy');
    const para = 'dummy ID'
    expect(service.getById(para)).resolves.toEqual(oneDish);
    expect(repoSpy).toBeCalledWith({ id: para });
  });

  it('getUsersBySearchName should get a list of user', async () => {
    await expect(service.getDishesBySearchName('apple pie')).resolves.toEqual(dishArray);
  });
});