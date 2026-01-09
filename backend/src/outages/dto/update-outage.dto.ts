import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OutageType } from '../outage-type.enum';
import { OutageStatus } from '../outage-status.enum';

export class UpdateOutageDto {
  @IsEnum(OutageType)
  type: OutageType;

  @IsInt()
  @Min(1)
  zoneId: number;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTimeEstimated?: string;

  @IsOptional()
  @IsEnum(OutageStatus)
  status?: OutageStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
