import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostComment } from '../../../shared/models/comment.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';
import { PostCommentsService } from './post-comments.service';

const postsHttpServiceStub = {
  addPostComment$: () => of(),
  updatePostComment$: () => of(),
};

describe('PostCommentsService', () => {
  let service: PostCommentsService;
  let postsHttpService: PostsHttpService;

  const createComment = (id: number, parent_id?: number): PostComment => ({
    id,
    parent_id,
    content: 'content',
    date: new Date(),
    postId: 1,
    replies: [],
    user: 'user',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostCommentsService,
        { provide: PostsHttpService, useValue: postsHttpServiceStub },
      ],
    });

    service = TestBed.inject(PostCommentsService);
    postsHttpService = TestBed.inject(PostsHttpService);
  });

  it('should get comments', () => {
    expect(service.comments()).toEqual([]);
  });

  it('should add root comment', waitForAsync(() => {
    const comment = createComment(1);
    jest
      .spyOn(postsHttpService, 'addPostComment$')
      .mockReturnValue(of(comment));

    service
      .addComment(1, { content: 'content', user: 'user' })
      .subscribe(() => {
        const expectedResult: PostComment[] = [comment];
        expect(service.comments()).toEqual(expectedResult);
      });
  }));

  it('should add child comment', waitForAsync(() => {
    const rootComment = createComment(1);
    const comment = createComment(2, 1);
    service.comments = [rootComment];
    jest
      .spyOn(postsHttpService, 'addPostComment$')
      .mockReturnValue(of(comment));

    service
      .addComment(1, { content: 'content', user: 'user' })
      .subscribe(() => {
        const expectedResult: PostComment[] = [
          { ...rootComment, replies: [comment] },
        ];
        expect(service.comments()).toEqual(expectedResult);
      });
  }));
});
