import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';

import { MenuModule } from 'src/menu/menu.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    MenuModule,
    RabbitModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
