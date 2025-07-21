import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class NotificationService implements OnModuleInit {
  async onModuleInit() {
    let retries = 5;
    let connected = false;

    while (!connected && retries > 0) {
      try {
        console.log('[NotificationService] Connecting to RabbitMQ...');
        const conn = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await conn.createChannel();

        await channel.assertExchange('order_exchange', 'fanout', { durable: true });
        const q = await channel.assertQueue('order.confirmation', { durable: true });
        await channel.bindQueue(q.queue, 'order_exchange', '');

        channel.consume(
          q.queue,
          (msg) => {
            const order = JSON.parse(msg.content.toString());
            console.log(`📧 Email sent to ${order.email}`);
            console.log(`Order ID: ${order.orderId}`);
            console.log('Items:', order.items);
            channel.ack(msg);
          },
          { noAck: false },
        );

        console.log('[NotificationService] ✅ RabbitMQ connected and listening');
        connected = true;
      } catch (err) {
        retries--;
        console.error(`[NotificationService] ❌ RabbitMQ connection failed. Retries left: ${retries}`);
        console.error('Reason:', err.message);
        await new Promise((res) => setTimeout(res, 5000));
      }
    }

    if (!connected) {
      console.error('[NotificationService] ❌ Failed to connect to RabbitMQ after several retries. Exiting.');
      process.exit(1);
    }
  }
}
