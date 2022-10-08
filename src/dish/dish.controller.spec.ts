import { Test } from '@nestjs/testing';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';

describe('DishController', () => {
    let controller: DishController;
    const resolvedValue = [
        {
            dishName: 'apple',
            cash_balance: 3
        }]
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [DishController],
            providers: [
                {
                    provide: DishService,
                    useValue: {
                        getDishesBySearchName: jest.fn()
                            .mockResolvedValue(resolvedValue)
                    }
                }
            ]

        }).compile();

        controller = module.get<DishController>(DishController);
    });

    it('Fetch Dish by keyword', async () => {
        await expect(controller.getResultBySearchController('apple'))
            .resolves.toEqual(resolvedValue);
    });
})