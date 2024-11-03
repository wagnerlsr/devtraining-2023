import { CoursesService } from './courses.service';
import { v4 as uuidv4 } from 'uuid';
import CourseDto from './dto/courseDto';

describe('CoursesService testes unitarios', () => {
  let service: CoursesService;
  let id: string;
  let created_at: Date;
  let expectOutputTags: any;
  let expectOutputCourses: any;
  let mockTagRepository: any;
  let mockCourseRepository: any;

  beforeEach(async () => {
    service = new CoursesService();

    id = uuidv4();
    created_at = new Date();

    expectOutputTags = [{ id, created_at, name: 'nestjs' }];

    expectOutputCourses = {
      id,
      created_at,
      name: 'test',
      description: 'test description',
      tags: expectOutputTags,
    };

    mockCourseRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      update: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      find: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findAll: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      findOne: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
      preload: jest.fn().mockReturnValue(Promise.resolve(expectOutputCourses)),
    };

    mockTagRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectOutputTags)),
      findOne: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um curso', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['courseRepository'] = mockCourseRepository;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['tagRepository'] = mockTagRepository;

    const courseDto: CourseDto = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    const newCourse = await service.create(courseDto);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(newCourse);
  });

  it('deve listar todos cursos', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['courseRepository'] = mockCourseRepository;

    const courses = await service.findAll();

    expect(mockCourseRepository.find).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(courses);
  });

  it('deve obter um curso por id', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['courseRepository'] = mockCourseRepository;

    const course = await service.findOne(id);

    expect(mockCourseRepository.findOne).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('deve atualizar um cruso', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['courseRepository'] = mockCourseRepository;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['tagRepository'] = mockTagRepository;

    const courseDto: CourseDto = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    };

    const course = await service.update(id, courseDto);

    expect(mockCourseRepository.save).toHaveBeenCalled();
    expect(mockCourseRepository.preload).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });

  it('deve remover um curso por id', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    service['courseRepository'] = mockCourseRepository;

    const course = await service.remove(id);

    expect(mockCourseRepository.findOne).toHaveBeenCalled();
    expect(mockCourseRepository.remove).toHaveBeenCalled();
    expect(expectOutputCourses).toStrictEqual(course);
  });
});
