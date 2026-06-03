import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  create(@Body() dto: CreateSemesterDto) {
    return this.semesterService.create(dto);
  }

  @Get()
  findAll() {
    return this.semesterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.semesterService.findOne(id);
  }
}
