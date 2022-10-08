import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('/internal/user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get('search-by-keyword')
    @ApiQuery({ name: 'keyword', type: String })
    @ApiOperation({
        summary:
            'Internal Usage: ' +
            'Search for user by name, ranked by relevance to search term ' +
            'Ex: keyword: "Ben Peterson"',
    })
    @ApiResponse({
        status: 200,
        description: ' Fetch User by keyword.',
    })
    async getResultBySearchController(
        @Query('keyword') keyword: string,
    ): Promise<User[]> {
        return this.userService.getUsersBySearchName(keyword);
    }
}
