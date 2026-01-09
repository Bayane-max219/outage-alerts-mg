import { IsEnum } from 'class-validator';
import { OutageStatus } from '../outage-status.enum';

export class UpdateOutageStatusDto {
  @IsEnum(OutageStatus)
  status: OutageStatus;
}
