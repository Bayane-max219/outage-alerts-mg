import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ZonesModule } from './zones/zones.module';
import { OutagesModule } from './outages/outages.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'jirama.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ZonesModule,
    OutagesModule,
    SubscriptionsModule,
  ],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AppModule {}
