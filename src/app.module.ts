import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { DishModule } from './dish/dish.module';
import { OpeningHoursModule } from './opening-hours/opening-hours.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { SeederModule } from './seeder/seeder.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    HttpModule,
    ConfigModule.forRoot(),
    UserModule,
    RestaurantModule,
    DishModule,
    OpeningHoursModule,
    PurchaseOrderModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
