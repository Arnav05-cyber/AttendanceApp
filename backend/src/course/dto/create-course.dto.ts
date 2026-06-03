import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  lecturesPerWeek?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  tutorialsPerWeek?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  labsPerWeek?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  minimumAttendance?: number;

  @IsInt()
  @IsPositive()
  semesterId: number;
}
