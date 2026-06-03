import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateSemesterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
