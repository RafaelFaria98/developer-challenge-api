import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';
import { PostsComponent } from './posts.component';

const postsHttpServiceStub = {
  getPosts$: () => of([]),
};

describe('PostsComponent', () => {
  let postsHttpService: PostsHttpService;
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;

  const createPost = (title?: string): Post => ({
    id: 1,
    author: 'author',
    content: 'content',
    description: 'description',
    publish_date: new Date(),
    slug: 'slug',
    title: title ?? 'title',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PostsHttpService, useValue: postsHttpServiceStub },
      ],
    }).overrideTemplate(PostsComponent, '');

    postsHttpService = TestBed.inject(PostsHttpService);
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate initial values', () => {
    expect(component).toBeTruthy();
    expect(component.allPosts).toEqual([]);
    expect(component.posts()).toEqual([]);
  });

  it('should initialize', waitForAsync(() => {
    const post: Post = createPost();
    jest.spyOn(postsHttpService, 'getPosts$').mockReturnValue(of([post]));

    component.ngOnInit();
    expect(component.allPosts).toEqual([post]);
    expect(component.posts()).toEqual([post]);
  }));

  it('should filter posts', () => {
    component.allPosts = [createPost('title 1'), createPost('title 2')];
    component.posts.set([]);

    component.filterPosts(undefined);
    expect(component.posts()).toEqual(component.allPosts);

    component.filterPosts('title 1');
    expect(component.posts()).toEqual([component.allPosts[0]]);
  });
});
