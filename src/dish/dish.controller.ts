import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Controller('/internal/dish')
export class DishController {
    constructor(private readonly dishService: DishService) { }


    @Get('search-by-keyword')
    @ApiQuery({ name: 'keyword', type: String })
    @ApiOperation({
        summary:
            'Internal Usage: ' +
            'Search for dish by name, ranked by relevance to search term ' +
            'Ex: keyword: "Apple Pie Ala Mode"',
    })
    @ApiResponse({
        status: 200,
        description: 'Fetch Dish by keyword.',
    })
    async getResultBySearchController(
        @Query('keyword') keyword: string,
    ): Promise<Dish[]> {
        return this.dishService.getDishesBySearchName(keyword);
    }
}
