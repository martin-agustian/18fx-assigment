import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Menu } from './menu/menu.entity';

import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { RabbitModule } from './rabbit/rabbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '') || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '18fx_assessment',
      autoLoadEntities: true,
      synchronize: true,
      entities: [Menu],
    }),
    RabbitModule,
    MenuModule,
    OrderModule
  ],
})
export class AppModule {}
