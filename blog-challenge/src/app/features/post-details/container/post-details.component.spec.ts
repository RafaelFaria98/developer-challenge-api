import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PostComment } from '../../../shared/models/comment.model';
import { Post } from '../../../shared/models/post.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';
import { PostCommentsService } from '../services/post-comments.service';
import { PostDetailsComponent } from './post-details.component';

const postsHttpServiceStub = {
  getPostDetails$: () => of(),
  getPostComments$: () => of(),
};

describe('PostDetailsComponent', () => {
  let postCommentsService: PostCommentsService;
  let postsHttpService: PostsHttpService;
  let component: PostDetailsComponent;
  let fixture: ComponentFixture<PostDetailsComponent>;

  const createPost = (): Post => ({
    id: 1,
    author: 'author',
    content: 'content',
    description: 'description',
    publish_date: new Date(),
    slug: 'slug',
    title: 'title',
  });

  const createComment = (): PostComment => ({
    id: 1,
    parent_id: 1,
    content: 'content',
    date: new Date(),
    postId: 1,
    replies: [],
    user: 'user',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostDetailsComponent],
      providers: [
        PostCommentsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 1 },
            },
          },
        },
        {
          provide: PostsHttpService,
          useValue: postsHttpServiceStub,
        },
      ],
    }).overrideTemplate(PostDetailsComponent, '');

    postCommentsService = TestBed.inject(PostCommentsService);
    postsHttpService = TestBed.inject(PostsHttpService);
    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize', waitForAsync(() => {
    const post = createPost();
    const comment = createComment();
    jest.spyOn(postsHttpService, 'getPostDetails$').mockReturnValue(of(post));
    jest
      .spyOn(postsHttpService, 'getPostComments$')
      .mockReturnValue(of([comment]));

    component.ngOnInit();

    expect(component.postDetails()).toEqual(post);
    expect(postCommentsService.comments()).toEqual([comment]);
  }));

  it('should add comment', () => {
    jest.spyOn(postCommentsService, 'addComment').mockReturnValue(of());

    component.addComment({ content: 'content', user: 'user' });

    expect(postCommentsService.addComment).toHaveBeenCalledWith(1, {
      user: 'user',
      content: 'content',
    });
    expect(component.isAddingComment()).toBeFalsy();
  });
});
