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
import { CreatePostDto } from './dto/create-post.dto';
import type { Post as PostInterface } from './interfaces/post.interface';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exists.pipe';

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
  getSinglePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): PostInterface {
    return this.postsService.getSinglePost(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(@Body() newPostData: CreatePostDto): PostInterface {
    return this.postsService.createPost(newPostData);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
    @Body() updatePostData: UpdatePostDto,
  ): PostInterface {
    return this.postsService.updatePost(id, updatePostData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id', ParseIntPipe, PostExistsPipe) id: number): void {
    this.postsService.deletePost(id);
  }
}
