import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateZoneDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
