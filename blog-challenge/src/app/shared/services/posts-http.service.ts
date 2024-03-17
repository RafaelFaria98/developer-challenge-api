import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../../core/tokens/api-token.model';
import { AddComment, EditComment } from '../models/comment-upsert.model';
import { PostComment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { PostsHttpHandlerService } from './handlers/posts-http-handler.service';

@Injectable({ providedIn: 'root' })
export class PostsHttpService {
  constructor(
    @Inject(API_URL) private readonly apiUrl: string,
    private readonly http: HttpClient,
    private readonly handler: PostsHttpHandlerService
  ) {}

  getPosts$(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.getPostsUrl())
      .pipe(map((posts) => this.handler.sortByPublishDate(posts)));
  }

  getPostDetails$(id: number): Observable<Post> {
    return this.http.get<Post>(this.getPostDetailsUrl(id));
  }

  getPostComments$(postId: number): Observable<PostComment[]> {
    return this.http
      .get<PostComment[]>(this.getPostCommentsUrl(postId))
      .pipe(map((comments) => this.handler.mapPostComments(comments)));
  }

  addPostComment$(
    postId: number,
    comment: AddComment
  ): Observable<PostComment> {
    return this.http
      .post<PostComment>(this.getPostCommentsUrl(postId), {
        user: comment.user,
        content: comment.content,
        parent_id: comment.parent_id ?? null,
        date: this.handler.formatDate(new Date()),
      })
      .pipe(map((item) => ({ ...item, replies: [] })));
  }

  updatePostComment$(
    postId: number,
    comment: EditComment
  ): Observable<PostComment> {
    return this.http.put<PostComment>(
      this.getUpdatePostCommentUrl(comment.id),
      {
        postId,
        user: comment.user,
        content: comment.content,
        date: this.handler.formatDate(new Date()),
        parent_id: comment.parent_id,
      }
    );
  }

  //#region Urls
  private getPostsUrl(): string {
    return `${this.apiUrl}posts`;
  }

  private getPostDetailsUrl(postId: number): string {
    return `${this.apiUrl}posts/${postId}`;
  }

  private getPostCommentsUrl(postId: number): string {
    return `${this.apiUrl}posts/${postId}/comments`;
  }

  private getUpdatePostCommentUrl(commentId: number): string {
    return `${this.apiUrl}comments/${commentId}`;
  }
  //#endregion
}
