import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { API_URL } from '../../core/tokens/api-token.model';
import { Post } from '../models/post.model';
import { PostsHttpHandlerService } from './handlers/posts-http-handler.service';
import { PostsHttpService } from './posts-http.service';

const postsHttpHandlerServiceStub = {
  sortByPublishDate: jest.fn(),
};

describe('PostsHttpService', () => {
  let service: PostsHttpService;
  let handler: PostsHttpHandlerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostsHttpService,
        { provide: API_URL, useValue: '' },
        {
          provide: PostsHttpHandlerService,
          useValue: postsHttpHandlerServiceStub,
        },
      ],
    });

    service = TestBed.inject(PostsHttpService);
    handler = TestBed.inject(PostsHttpHandlerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get posts', waitForAsync(() => {
    const result: Post[] = [];
    jest.spyOn(handler, 'sortByPublishDate').mockReturnValue(result);

    service.getPosts$().subscribe((item) => {
      expect(item).toEqual(result);
      expect(handler.sortByPublishDate).toHaveBeenCalledWith(result);
    });
    const httpRequest = httpMock.expectOne('posts');
    expect(httpRequest.request.method).toEqual('GET');
    httpRequest.flush(result);
    httpMock.verify();
  }));
});
