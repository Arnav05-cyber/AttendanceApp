import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { SemesterService } from '../semester/semester.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly semesterService: SemesterService,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    const semester = await this.semesterService.findOne(dto.semesterId);
    const course = this.courseRepo.create({ ...dto, semester });
    return this.courseRepo.save(course);
  }

  findAll(): Promise<Course[]> {
    return this.courseRepo.find({ relations: ['semester'] });
  }

  findBySemester(semesterId: number): Promise<Course[]> {
    return this.courseRepo.find({
      where: { semester: { id: semesterId } },
      relations: ['semester'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id }, relations: ['semester'] });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
  }
}
