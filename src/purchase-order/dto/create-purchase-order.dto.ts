import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreatePurchaseOrderDto {
  @ApiProperty({
    description: 'User id',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Dish id',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  dish_id: string;
}
