import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { Zone } from '../zones/zone.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
  ) {}

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const zone = await this.zonesRepository.findOne({
      where: { id: dto.zoneId },
    });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    const subscription = this.subscriptionsRepository.create({
      userEmail: dto.userEmail,
      zone,
    });
    return this.subscriptionsRepository.save(subscription);
  }

  findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      order: {
        userEmail: 'ASC',
      },
    });
  }

  findByZoneId(zoneId: number): Promise<Subscription[]> {
    return this.subscriptionsRepository.find({
      where: { zone: { id: zoneId } },
    });
  }
}
