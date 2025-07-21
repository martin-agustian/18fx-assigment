import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { RabbitService } from 'src/rabbit/rabbit.service';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rabbitService: RabbitService,
  ) {}

  @Post()
  async placeOrder(@Body() dto: CreateOrderDto) {
    const order = await this.orderService.createOrder(dto);
    await this.rabbitService.publishOrder(order); // fanout ke RabbitMQ
    return { orderId: order.id };
  }

  @Get(':id')
  async getOrder(@Param('id') id: number) {
    return this.orderService.findById(+id);
  }
}

