import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Test } from '@nestjs/testing';

describe('UsersController', () => {
    let controller: UserController;
    const resolvedValue = [
        { id: '123-456', name: 'ben hu 2', cash_balance: 3 },
        { id: '123-453', name: 'ben hu 1', cash_balance: 4 }
    ]

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getUsersBySearchName: jest.fn().mockResolvedValue(resolvedValue
                        )
                    }
                }
            ]

        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('getById should get searched users', async () => {
        await expect(controller.getResultBySearchController('ben hu')).resolves.toEqual(resolvedValue);
    });
})