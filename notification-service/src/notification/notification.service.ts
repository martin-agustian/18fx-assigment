import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class NotificationService implements OnModuleInit {
  async onModuleInit() {
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await channel.assertExchange('order_exchange', 'fanout', { durable: true });
    const q = await channel.assertQueue('order.confirmation', { durable: true });
    await channel.bindQueue(q.queue, 'order_exchange', '');

    channel.consume(
      q.queue,
      (msg) => {
        const order = JSON.parse(msg.content.toString());
        console.log(`📧 [Notification] Email sent to ${order.email}`);
        console.log(`Order ID: ${order.orderId}`);
        console.log('Items:', order.items);

        // Simulasi pengiriman email
        // Di production, bisa pakai nodemailer, Mailgun, dll

        channel.ack(msg);
      },
      { noAck: false },
    );
  }
}
