import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostExistsPipe } from './pipes/post-exists.pipe';
import { PostsService } from './posts.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginationResponse } from 'src/common/interfaces/paginated-response.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(
    @Query() query: FindPostsQueryDto,
  ): Promise<PaginationResponse<PostEntity>> {
    return this.postsService.getAllPosts(query);
  }

  @Get(':id')
  async getSinglePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<PostEntity> {
    return this.postsService.getSinglePost(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async updatePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(id, updatePostData, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<void> {
    this.postsService.deletePost(id);
  }
}
