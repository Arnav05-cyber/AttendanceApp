import { Body, Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { UpdateCalendarDayDto } from './dto/update-calendar-day.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('semester/:semesterId')
  getBySemester(@Param('semesterId', ParseIntPipe) semesterId: number) {
    return this.calendarService.getBySemester(semesterId);
  }

  @Patch('day/:id')
  updateDay(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCalendarDayDto,
  ) {
    return this.calendarService.updateDay(id, dto);
  }
}
