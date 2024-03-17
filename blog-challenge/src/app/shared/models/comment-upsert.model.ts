import { CommentActionType } from '../enums/comment-action-type.enum';

export interface AddComment {
  user: string;
  content: string;
  parent_id?: number;
}

export interface EditComment extends AddComment {
  id: number;
}

export interface CommentAction {
  type: CommentActionType;
  content?: string;
}

export interface CommentActionResult {
  user?: string;
  content: string;
}
