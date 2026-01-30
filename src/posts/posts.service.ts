import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { User, UserRole } from 'src/auth/entities/user.entity';
import { PaginationResponse } from 'src/common/interfaces/paginated-response.interface';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private postListCacheKeys: Set<string> = new Set();

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostsListCacheKey(query: FindPostsQueryDto): string {
    const { page = 1, limit = 10, title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
  }

  private async invalidateAllExistingListCaches(): Promise<void> {
    console.log(
      `Invalidating ${this.postListCacheKeys.size} list cache entries`,
    );

    for (const cacheKey of this.postListCacheKeys) {
      await this.cacheManager.del(cacheKey);
    }

    this.postListCacheKeys.clear();
  }

  async getAllPosts(
    query: FindPostsQueryDto,
  ): Promise<PaginationResponse<Post>> {
    const cacheKey = this.generatePostsListCacheKey(query);

    this.postListCacheKeys.add(cacheKey);

    const getCachedData =
      await this.cacheManager.get<PaginationResponse<Post>>(cacheKey);

    if (getCachedData) {
      console.log(
        `Cache Hit-------->Returning posts list from Cache ${cacheKey}`,
      );
      return getCachedData;
    }
    console.log(`Cache Miss-------->Returning posts list from Database`);

    const { page = 1, limit = 10, title } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cacheKey, responseResult, 30000);

    return responseResult;
  }

  async getSinglePost(postId: number): Promise<Post> {
    const cacheKey = `post_${postId}`;
    const cachedPost = await this.cacheManager.get<Post>(cacheKey);

    if (cachedPost) {
      console.log(
        `Cache Hit-------->Returning post list from Cache ${cacheKey}`,
      );
      return cachedPost;
    }

    console.log(`Cache Miss-------->Returning posts list from Database`);

    const singlePost = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['authorName'],
    });

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${postId} is not found!`);
    }

    await this.cacheManager.set(cacheKey, singlePost, 30000);

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

    await this.invalidateAllExistingListCaches();

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

    const updatedPost = await this.postsRepository.save(findPostToUpdate);

    await this.cacheManager.del(`post_${postId}`);

    await this.invalidateAllExistingListCaches();

    return updatedPost;
  }

  async deletePost(postId: number): Promise<void> {
    const findPostToDelete = await this.getSinglePost(postId);

    await this.postsRepository.remove(findPostToDelete);

    await this.cacheManager.del(`post_${postId}`);

    await this.invalidateAllExistingListCaches();
  }
}
