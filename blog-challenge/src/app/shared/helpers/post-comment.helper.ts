import { PostComment } from '../models/comment.model';

/**
 * Iterates over the comments tree to get the specified comment.
 *
 * @param comments The comments tree.
 * @param commentId The comment identifier.
 * @returns If found, the comment, otherwise `undefined`.
 */
export const findPostComment = (
  comments: PostComment[],
  commentId: number
): PostComment | undefined => {
  for (const item of comments) {
    if (item.id === commentId) {
      return item;
    }

    if (item.replies.length > 0) {
      const comment = findPostComment(item.replies, commentId);
      if (comment != null) {
        return comment;
      }
    }
  }

  return undefined;
};
