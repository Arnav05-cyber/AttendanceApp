import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DayType } from '../day-type.enum';

export class UpdateCalendarDayDto {
  @IsEnum(DayType)
  @IsOptional()
  dayType?: DayType;

  @IsString()
  @IsOptional()
  description?: string;
}
