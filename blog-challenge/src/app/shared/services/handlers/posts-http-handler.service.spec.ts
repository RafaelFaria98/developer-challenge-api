import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Post } from '../../models/post.model';
import { PostsHttpHandlerService } from './posts-http-handler.service';

describe('PostsHttpHandlerService', () => {
  let service: PostsHttpHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsHttpHandlerService, DatePipe],
    });

    service = TestBed.inject(PostsHttpHandlerService);
  });

  it('should sort by publish date', () => {
    const oldestPost: Post = {
      id: 1,
      author: 'author',
      content: 'content',
      description: 'description',
      publish_date: new Date('2024-02-17'),
      slug: 'slug',
      title: 'title',
    };
    const newestPost = { ...oldestPost, publish_date: new Date('2024-03-17') };
    const posts: Post[] = [oldestPost, newestPost];
    const expectedResult: Post[] = [newestPost, oldestPost];

    expect(service.sortByPublishDate(posts)).toEqual(expectedResult);
  });
});
