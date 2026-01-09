import { IsEmail, IsInt, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  userEmail: string;

  @IsInt()
  @Min(1)
  zoneId: number;
}
