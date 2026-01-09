import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
