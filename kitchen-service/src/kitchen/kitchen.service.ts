import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../order/order.entity';

@Injectable()
export class KitchenService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async onModuleInit() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertExchange('order_exchange', 'fanout', { durable: true });
    const q = await channel.assertQueue('order.process', { durable: true });
    await channel.bindQueue(q.queue, 'order_exchange', '');

    channel.consume(
      q.queue,
      async (msg) => {
        const content = JSON.parse(msg.content.toString());
        const orderId = content.orderId;
        console.log(`[Kitchen] Received order ${orderId}, processing...`);

        await this.orderRepo.update(orderId, { status: 'Processed' });
        channel.ack(msg);
      },
      { noAck: false },
    );
  }
}
