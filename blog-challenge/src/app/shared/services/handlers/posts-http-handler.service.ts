import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { findPostComment } from '../../helpers/post-comment.helper';
import { PostComment } from '../../models/comment.model';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsHttpHandlerService {
  constructor(private readonly datePipe: DatePipe) {}

  /**
   * Sorts the posts.
   *
   * @param posts The posts.
   * @returns Posts sorted by publish date, from newest to oldest.
   */
  sortByPublishDate(posts: Post[]): Post[] {
    return posts.sort(
      (first, second) =>
        new Date(second.publish_date).getTime() -
        new Date(first.publish_date).getTime()
    );
  }

  /**
   * Formats a given date.
   *
   * @param date The date.
   * @returns The formatted date.
   * @example '2024-03-16'
   */
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') as string;
  }

  /**
   * Map the post comments by associating their replies to itself.
   *
   * @param comments The comments list.
   * @returns The comments tree.
   * @description The comment replies are added to the comment itself.
   */
  mapPostComments(comments: PostComment[]): PostComment[] {
    const commentsTree = comments.map((item) => ({ ...item, replies: [] }));
    commentsTree
      .filter((item) => item.parent_id)
      .forEach((comment) => {
        const parent = findPostComment(
          commentsTree,
          comment.parent_id as number
        );
        if (parent) {
          parent.replies = [...(parent.replies ?? []), comment];
        }
      });

    return commentsTree.filter((item) => item.parent_id == null);
  }
}
