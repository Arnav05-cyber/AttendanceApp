import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './semester.entity';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Semester]), CalendarModule],
  providers: [SemesterService],
  controllers: [SemesterController],
  exports: [SemesterService],
})
export class SemesterModule {}
