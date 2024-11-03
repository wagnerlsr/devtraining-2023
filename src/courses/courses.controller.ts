import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

import { CoursesService } from './courses.service';
import CourseDto from './dto/courseDto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Res() response: any) {
    this.coursesService.findAll().then((c) => response.status(200).json(c));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() body: CourseDto) {
    return this.coursesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: CourseDto) {
    return this.coursesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
