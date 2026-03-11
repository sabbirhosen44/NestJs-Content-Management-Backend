import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class FindPostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Search posts by title',
    example: 'nestjs',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
