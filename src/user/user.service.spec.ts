import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const testUser1 = 'fake user name';
const testUser2 = 'fake user name2';

const oneUser = new User();
oneUser.name = testUser1
oneUser.cash_balance = 123


const secondUser = new User();
secondUser.name = testUser2
secondUser.cash_balance = 456


const userArray = [oneUser, secondUser]


const createQueryBuilder: any = {
  orderBy: () => createQueryBuilder,
  where: () => createQueryBuilder,
  getRawMany: () => Promise.resolve(userArray),
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            createQueryBuilder: jest.fn().mockImplementation(
              () => createQueryBuilder
            )
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getById should get a one user', async () => {
    const repoSpy = jest.spyOn(repo, 'findOneBy');
    const para = 'dummy id'
    await expect(service.getById(para)).resolves.toEqual(oneUser);
    expect(repoSpy).toBeCalledWith({ id: para });
  });

  it('getUsersBySearchName should get a list of user', async () => {
    await expect(service.getUsersBySearchName('ben hu')).resolves.toEqual(userArray);
  });
});