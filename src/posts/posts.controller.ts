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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import type { Post as PostInterface } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(@Query('search') search?: string): PostInterface[] {
    const extractAllPosts = this.postsService.getAllPosts();

    if (search) {
      return extractAllPosts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return extractAllPosts;
  }

  @Get(':id')
  getSinglePost(@Param('id', ParseIntPipe) id: number): PostInterface {
    return this.postsService.getSinglePost(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Body() newPostData: Omit<PostInterface, 'id' | 'createdAt'>,
  ): PostInterface {
    return this.postsService.createPost(newPostData);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostData: Partial<Omit<PostInterface, 'id' | 'createdAt'>>,
  ): PostInterface {
    return this.postsService.updatePost(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe) id: number): void {
    this.postsService.deletePost(id);
  }
}
