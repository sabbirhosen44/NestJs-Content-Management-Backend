import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async getSinglePost(postId: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOneBy({ id: postId });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${postId} is not found!`);
    }

    return singlePost;
  }

  async createPost(newPostData: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: newPostData.title,
      content: newPostData.content,
      authorName: newPostData.authorName,
    });

    return this.postsRepository.save(newPost);
  }

  async updatePost(
    postId: number,
    updatePostData: UpdatePostDto,
  ): Promise<Post> {
    const findPostToUpdate = await this.getSinglePost(postId);

    Object.assign(findPostToUpdate, updatePostData);

    return this.postsRepository.save(findPostToUpdate);
  }

  async deletePost(postId: number): Promise<void> {
    const findPostToDelete = await this.getSinglePost(postId);

    await this.postsRepository.remove(findPostToDelete);
  }
}
