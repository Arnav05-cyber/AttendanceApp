import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { SemesterModule } from '../semester/semester.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), SemesterModule],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
