import * as amqp from 'amqplib';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';

@Injectable()
export class KitchenService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async onModuleInit() {
    let retries = 5;
    let connected = false;

    while (!connected && retries > 0) {
      try {
        console.log('[KitchenService] Connecting to RabbitMQ...');
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await conn.createChannel();

        await channel.assertExchange('order_exchange', 'fanout', { durable: true });
        const q = await channel.assertQueue('order.process', { durable: true });
        await channel.bindQueue(q.queue, 'order_exchange', '');

        channel.consume(
          q.queue,
          async (msg) => {
            const order = JSON.parse(msg.content.toString());
            console.log(`[KitchenService] 👨‍🍳 Received order #${order.orderId}, marking as processed...`);
            await this.orderRepo.update(order.orderId, { status: 'Processed' });
            channel.ack(msg);
          },
          { noAck: false },
        );

        console.log('[KitchenService] ✅ RabbitMQ connected and listening');
        connected = true;
      } catch (err) {
        retries--;
        console.error(`[KitchenService] ❌ RabbitMQ connection failed. Retries left: ${retries}`);
        console.error('Reason:', err.message);
        await new Promise((res) => setTimeout(res, 5000));
      }
    }

    if (!connected) {
      console.error('[KitchenService] ❌ Failed to connect to RabbitMQ after several retries. Exiting.');
      process.exit(1);
    }
  }
}
