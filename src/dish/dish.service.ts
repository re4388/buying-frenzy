import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) { }

  getById(id: string): Promise<Dish> {
    return this.dishRepository.findOneBy({ id });
  }

  getDishesBySearchName(keyword: string): Promise<Dish[]> {
    return this.dishRepository
      .createQueryBuilder()
      .where('name Like :keyword', { keyword: `%${keyword}%` })
      .orderBy(`INSTR(name, '${keyword}' ) `)
      .getRawMany();
  }
}
