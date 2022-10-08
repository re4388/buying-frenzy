import { Test } from '@nestjs/testing';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';

describe('SeederController', () => {
  let controller: SeederController;
  let service: SeederService

  const serviceMock = {
    importData: jest.fn()
      .mockResolvedValue(true)
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SeederController],
      providers: [
        {
          provide: SeederService,
          useValue: serviceMock
        }
      ]

    }).compile();

    service = module.get<SeederService>(SeederService);
    controller = module.get<SeederController>(SeederController);
  });

  it('Import data into database', async () => {
    const importDataSpy = jest.spyOn(service, 'importData');
    await expect(controller.createSeed()).resolves.toEqual(true)
    expect(importDataSpy).toBeCalled()
  });
})