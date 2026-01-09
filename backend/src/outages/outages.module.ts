import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outage } from './outage.entity';
import { Zone } from '../zones/zone.entity';
import { OutagesService } from './outages.service';
import { OutagesController } from './outages.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outage, Zone]),
    SubscriptionsModule,
    EmailModule,
  ],
  providers: [OutagesService],
  controllers: [OutagesController],
})
export class OutagesModule {}
