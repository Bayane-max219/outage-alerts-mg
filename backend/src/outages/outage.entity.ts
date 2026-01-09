import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Zone } from '../zones/zone.entity';
import { OutageType } from './outage-type.enum';
import { OutageStatus } from './outage-status.enum';

@Entity('outages')
export class Outage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: OutageType;

  @ManyToOne(() => Zone, { eager: true })
  zone: Zone;

  @Column({ name: 'start_time', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'end_time_estimated', type: 'datetime', nullable: true })
  endTimeEstimated: Date | null;

  @Column({ type: 'text' })
  status: OutageStatus;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
