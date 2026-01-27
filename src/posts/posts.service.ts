import { Injectable, NotFoundException } from '@nestjs/common';
import type { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'First',
      content: 'First Post Content',
      authorName: 'Sabbir',
      createdAt: new Date(),
    },
  ];

  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }

  getAllPosts(): Post[] {
    return this.posts;
  }

  getSinglePost(postId: number): Post {
    const singlePost = this.posts.find((post) => post.id === postId);

    if (!singlePost) {
      throw new NotFoundException(`Post with ID ${postId} is not found!`);
    }

    return singlePost;
  }

  createPost(newPostData: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      createdAt: new Date(),
      ...newPostData,
    };
    this.posts.push(newPost);
    return newPost;
  }

  updatePost(
    postId: number,
    updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>,
  ): Post {
    const currentPostIndexToEdit = this.posts.findIndex(
      (post) => post.id === postId,
    );

    if (currentPostIndexToEdit === -1) {
      throw new NotFoundException(`Post with ID ${postId} is not found`);
    }

    this.posts[currentPostIndexToEdit] = {
      ...this.posts[currentPostIndexToEdit],
      ...updatePostData,
      updatedAt: new Date(),
    };

    return this.posts[currentPostIndexToEdit];
  }

  deletePost(postId: number): { message: string } {
    const postIndexToDelete = this.posts.findIndex(
      (post) => post.id === postId,
    );

    if (postIndexToDelete === -1) {
      throw new NotFoundException(`Post with ID ${postId} is not found`);
    }

    this.posts.splice(postIndexToDelete, 1);

    return { message: `Post with ID ${postId} has been deleted` };
  }
}
