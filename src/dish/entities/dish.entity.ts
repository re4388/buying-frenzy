import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { PurchaseOrder } from '../../purchase-order/entities/purchase-order.entity';

@Entity()
export class Dish extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 1000 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2, unsigned: true })
  price: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
    eager: true,
  })
  @JoinColumn()
  restaurant: Restaurant;

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.dish)
  purchase_orders: PurchaseOrder[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
