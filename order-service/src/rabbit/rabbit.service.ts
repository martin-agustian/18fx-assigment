import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Order } from '../order/order.entity';

@Injectable()
export class RabbitService implements OnModuleInit {
  private channel: amqp.Channel;

  async onModuleInit() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await conn.createChannel();
    await this.channel.assertExchange('order_exchange', 'fanout', {
      durable: true,
    });
  }

  async publishOrder(order: Order) {
    const payload = {
      orderId: order.id,
      email: order.customerEmail,
      items: order.items,
    };
    this.channel.publish(
      'order_exchange',
      '',
      Buffer.from(JSON.stringify(payload)),
    );
  }
}
