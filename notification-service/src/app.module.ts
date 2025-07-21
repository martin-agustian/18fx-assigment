import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [NotificationService],
})
export class AppModule {}
