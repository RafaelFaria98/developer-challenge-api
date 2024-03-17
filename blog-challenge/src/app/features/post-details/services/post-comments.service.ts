import { Injectable, Signal, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { findPostComment } from '../../../shared/helpers/post-comment.helper';
import {
  AddComment,
  EditComment,
} from '../../../shared/models/comment-upsert.model';
import { PostComment } from '../../../shared/models/comment.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';

@Injectable({ providedIn: 'root' })
export class PostCommentsService {
  private readonly _comments = signal<PostComment[]>([]);

  /**
   * Gets the comments.
   *
   * @returns The {@link Signal<PostComment[]>}
   */
  get comments(): Signal<PostComment[]> {
    return this._comments;
  }

  /**
   * Sets the comments.
   */
  set comments(value: PostComment[]) {
    this._comments.set(value);
  }

  constructor(private readonly postsHttpService: PostsHttpService) {}

  /**
   * Sends an HTTP request to add a comment and updates the comments list signal.
   *
   * @param postId The post identifier.
   * @param comment The comment to add.
   */
  addComment(postId: number, comment: AddComment): Observable<void> {
    return this.postsHttpService.addPostComment$(postId, comment).pipe(
      map((comment) => {
        this._comments.update((comments) => {
          if (comment.parent_id == null) {
            return [...comments, comment];
          }

          const parent = findPostComment(comments, comment.parent_id);
          if (parent) {
            parent.replies = [...(parent.replies ?? []), comment];
          }

          return [...comments];
        });
      })
    );
  }

  /**
   * Sends an HTTP request to update the comment and updates the comments list signal.
   *
   * @param postId The post identifier.
   * @param comment The comment to edit.
   */
  editComment(postId: number, comment: EditComment): Observable<void> {
    return this.postsHttpService.updatePostComment$(postId, comment).pipe(
      map((updatedComment) => {
        this._comments.update((comments) => {
          let commentToUpdate = findPostComment(comments, comment.id);
          if (commentToUpdate) {
            Object.assign(commentToUpdate, updatedComment);
          }

          return [...comments];
        });
      })
    );
  }
}
