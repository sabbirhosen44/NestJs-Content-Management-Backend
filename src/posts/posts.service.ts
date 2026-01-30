import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { User, UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['authorName'],
    });
  }

  async getSinglePost(postId: number): Promise<Post> {
    const singlePost = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['authorName'],
    });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${postId} is not found!`);
    }

    return singlePost;
  }

  async createPost(
    newPostData: CreatePostDto,
    authorName: User,
  ): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: newPostData.title,
      content: newPostData.content,
      authorName,
    });

    return this.postsRepository.save(newPost);
  }

  async updatePost(
    postId: number,
    updatePostData: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const findPostToUpdate = await this.getSinglePost(postId);

    if (
      findPostToUpdate.authorName.id === user.id &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(findPostToUpdate, updatePostData);

    return this.postsRepository.save(findPostToUpdate);
  }

  async deletePost(postId: number): Promise<void> {
    const findPostToDelete = await this.getSinglePost(postId);

    await this.postsRepository.remove(findPostToDelete);
  }
}
