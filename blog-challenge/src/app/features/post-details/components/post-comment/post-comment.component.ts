import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommentActionType } from '../../../../shared/enums/comment-action-type.enum';
import {
  AddComment,
  CommentAction,
  CommentActionResult,
  EditComment,
} from '../../../../shared/models/comment-upsert.model';
import { PostComment } from '../../../../shared/models/comment.model';
import { PostCommentsService } from '../../services/post-comments.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CommentFormComponent,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCommentComponent {
  @Input({ required: true }) comment!: PostComment;

  readonly isEditing = signal(false);
  readonly isReplying = signal(false);

  commentAction?: CommentAction;

  constructor(private readonly postsCommentsService: PostCommentsService) {}

  startEdit(): void {
    this.isEditing.set(true);
    this.commentAction = {
      type: CommentActionType.edit,
      content: this.comment.content,
    };
  }

  startReply(): void {
    this.isReplying.set(true);
    this.commentAction = { type: CommentActionType.reply };
  }

  handleSubmit(result: CommentActionResult): void {
    if (this.commentAction?.type === CommentActionType.edit) {
      this.editComment(result.content);
    } else {
      this.replyComment(result);
    }

    this.commentAction = undefined;
  }

  handleCancel(): void {
    if (this.commentAction?.type === CommentActionType.edit) {
      this.isEditing.set(false);
    } else {
      this.isReplying.set(false);
    }

    this.commentAction = undefined;
  }

  private editComment(newContent: string): void {
    const request: EditComment = {
      id: this.comment.id,
      user: this.comment.user,
      parent_id: this.comment.parent_id,
      content: newContent,
    };
    this.postsCommentsService
      .editComment(this.comment.postId, request)
      .subscribe(() => this.isEditing.set(false));
  }

  private replyComment(result: CommentActionResult): void {
    if (result.user == null) {
      return;
    }

    const request: AddComment = {
      user: result.user,
      parent_id: this.comment.id,
      content: result.content,
    };
    this.postsCommentsService
      .addComment(this.comment.postId, request)
      .subscribe(() => this.isReplying.set(false));
  }
}
