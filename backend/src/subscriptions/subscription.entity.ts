import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Zone } from '../zones/zone.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_email' })
  userEmail: string;

  @ManyToOne(() => Zone, { eager: true })
  zone: Zone;
}
