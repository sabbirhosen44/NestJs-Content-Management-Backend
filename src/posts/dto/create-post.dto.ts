import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Understanding Dependency Injection in NestJS',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    description: 'Main content of the post',
    example:
      'Dependency Injection is a design pattern used extensively in NestJS to manage dependencies between classes.',
    minLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  content: string;
}
