import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import CourseDto from './dto/courseDto';

@Injectable()
export class CoursesService {
  @InjectRepository(Course)
  private readonly courseRepository: Repository<Course>;

  @InjectRepository(Tag)
  private readonly tagRepository: Repository<Tag>;

  async findAll() {
    return await this.courseRepository.find({ relations: ['tags'] });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!course)
      throw new HttpException(
        `Course ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );

    return course;
  }

  async create(courseDto: CourseDto) {
    const tags = await Promise.all(
      courseDto.tags.map((name) => this.preloadTagByName(name)),
    );

    const course = this.courseRepository.create({ ...courseDto, tags });

    return this.courseRepository.save(course);
  }

  async update(id: string, courseDto: CourseDto) {
    const tags =
      courseDto.tags &&
      (await Promise.all(
        courseDto.tags.map((name) => this.preloadTagByName(name)),
      ));

    const course = await this.courseRepository.preload({
      ...courseDto,
      id,
      tags,
    });

    if (!course) throw new NotFoundException(`Course ID ${id} not found`);

    return this.courseRepository.save(course);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({ where: { id } });

    if (!course) throw new NotFoundException(`Course ID ${id} not found`);

    return this.courseRepository.remove(course);
  }

  private async preloadTagByName(name: string) {
    const tag = await this.tagRepository.findOne({ where: { name } });

    if (tag) return tag;

    return this.tagRepository.create({ name });
  }
}
