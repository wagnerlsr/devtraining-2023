import 'dotenv/config';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'process';
import request from 'supertest';
import { DataSource, DataSourceOptions } from 'typeorm';

import { CoursesModule } from './courses.module';
import { Course } from './entities/course.entity';
import { Tag } from './entities/tag.entity';

describe('CoursesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let data: any;
  let courses: Course[];

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [Course, Tag],
    synchronize: true,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    data = {
      name: 'Node.js',
      description: 'Node.js',
      tags: ['nodejs', 'nestjs'],
    };
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Course);

    courses = await repository.find();

    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /courses', () => {
    it('deve criar um curso', async () => {
      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body.created_at).toBeDefined();
      expect(res.body.tags[0].name).toEqual(data.tags[0]);
    });
  });

  describe('GET /courses', () => {
    it('deve listar todos os cursos', async () => {
      const res = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);

      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].name).toEqual(data.name);
      expect(res.body[0].description).toEqual(data.description);
      expect(res.body[0].created_at).toBeDefined();

      res.body.map((item: any) =>
        expect(item).toEqual({
          id: item.id,
          name: item.name,
          description: item.description,
          created_at: item.created_at,
          tags: [...item.tags],
        }),
      );
    });
  });

  describe('GET /courses/:id', () => {
    it('deve obter um curso por id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/courses/${courses[0].id}`)
        .expect(200);

      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual(courses[0].name);
      expect(res.body.description).toEqual(courses[0].description);
    });
  });

  describe('PUT /courses/:id', () => {
    it('deve atualizar um curso por id', async () => {
      const upData = {
        name: 'Nodejs',
        description: 'Nodejs',
        tags: ['nodejs', 'nestjs', 'javascript'],
      };

      const res = await request(app.getHttpServer())
        .put(`/courses/${courses[0].id}`)
        .send(upData)
        .expect(200);

      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual('Nodejs');
      expect(res.body.description).toEqual('Nodejs');
      expect(res.body.tags).toHaveLength(3);
      expect(res.body.tags[2].name).toEqual('javascript');
    });
  });

  describe('DELETE /courses/:id', () => {
    it('deve remover um curso por id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/courses/${courses[0].id}`)
        .expect(204)
        .expect({});
    });
  });
});
