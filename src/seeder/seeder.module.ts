import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { HttpModule } from '@nestjs/axios';
import { SeederController } from './seeder.controller';

@Module({
  imports: [HttpModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule { }
