import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
