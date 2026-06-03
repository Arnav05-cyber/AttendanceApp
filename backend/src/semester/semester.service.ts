import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './semester.entity';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepo: Repository<Semester>,
    private readonly calendarService: CalendarService,
  ) {}

  async create(dto: CreateSemesterDto): Promise<Semester> {
    const semester = this.semesterRepo.create(dto);
    const saved = await this.semesterRepo.save(semester);
    await this.calendarService.generateSemesterCalendar(saved);
    return saved;
  }

  findAll(): Promise<Semester[]> {
    return this.semesterRepo.find();
  }

  findOne(id: number): Promise<Semester> {
    return this.semesterRepo.findOneByOrFail({ id });
  }
}
