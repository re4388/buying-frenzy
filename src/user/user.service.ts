import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  getById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  getUsersBySearchName(keyword: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder()
      .where('name Like :keyword', { keyword: `%${keyword}%` })
      .orderBy(`INSTR(name, '${keyword}' ) `)
      .getRawMany();
  }
}
