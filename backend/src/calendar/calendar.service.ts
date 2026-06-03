import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarDay } from './calendar-day.entity';
import { DayType } from './day-type.enum';
import { Semester } from '../semester/semester.entity';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarDay)
    private readonly calendarDayRepo: Repository<CalendarDay>,
  ) {}

  async generateSemesterCalendar(semester: Semester): Promise<CalendarDay[]> {
    const start = new Date(semester.startDate);
    const end = new Date(semester.endDate);
    const days: CalendarDay[] = [];

    for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const day = this.calendarDayRepo.create({
        date: date.toISOString().split('T')[0],
        dayType: date.getDay() === 0 || date.getDay() === 6 ? DayType.WEEKEND_DAY : DayType.WORKING_DAY,
        semester,
      });
      days.push(day);
    }

    return this.calendarDayRepo.save(days);
  }

  getBySemester(semesterId: number): Promise<CalendarDay[]> {
    return this.calendarDayRepo.find({
      where: { semester: { id: semesterId } },
      order: { date: 'ASC' },
    });
  }

  async updateDay(id: number, dto: UpdateCalendarDayDto): Promise<CalendarDay> {
    const day = await this.calendarDayRepo.findOneBy({ id });
    if (!day) throw new NotFoundException(`Calendar day ${id} not found`);
    Object.assign(day, dto);
    return this.calendarDayRepo.save(day);
  }
}
