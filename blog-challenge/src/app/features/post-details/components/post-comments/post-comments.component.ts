import { Component, Input } from '@angular/core';
import { PostComment } from '../../../../shared/models/comment.model';
import { PostCommentComponent } from '../post-comment/post-comment.component';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss'],
  standalone: true,
  imports: [PostCommentComponent],
})
export class PostCommentsComponent {
  @Input({ required: true }) comments: PostComment[] = [];
}
