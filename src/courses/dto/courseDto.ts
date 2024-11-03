import { IsString } from 'class-validator';

export default class CourseDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString({ each: true })
  readonly tags: string[];
}
