import 'dotenv/config';

import * as process from 'process';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Course } from '../courses/entities/course.entity';
import { Tag } from '../courses/entities/tag.entity';
import { CreateCoursesTable1696419134257 } from '../migrations/1696419134257-CreateCoursesTable';
import { CreateTagsTable1696420552883 } from '../migrations/1696420552883-CreateTagsTable';
import { CreateCoursesTagsTable1696424837008 } from '../migrations/1696424837008-CreateCoursesTagsTable';
import { AddCoursesIdToCoursesTagsTable1696425429301 } from '../migrations/1696425429301-AddCoursesIdToCoursesTagsTable';
import { AddTagsIdToCoursesTagsTable1696428311071 } from '../migrations/1696428311071-AddTagsIdToCoursesTagsTable';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Course, Tag],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTable1696419134257,
    CreateTagsTable1696420552883,
    CreateCoursesTagsTable1696424837008,
    AddCoursesIdToCoursesTagsTable1696425429301,
    AddTagsIdToCoursesTagsTable1696428311071,
  ],
});
