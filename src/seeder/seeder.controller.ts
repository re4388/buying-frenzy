import { Controller, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/v1/seeder')
export class SeederController {
  constructor(private readonly SeederService: SeederService) { }

  @Get('insert')
  @ApiOperation({
    summary: 'Import data into database',
  })
  @ApiResponse({ status: 200, description: 'return true' })
  async createSeed(): Promise<boolean> {
    await this.SeederService.importData();
    return true;
  }
}
