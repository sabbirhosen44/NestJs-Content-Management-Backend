import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Sabbir Hosen',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'Name is required! Please provide name' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot be longer than 50 characters' })
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required! Please provide Password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
