import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Pipe,
  PipeTransform,
  SecurityContext,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, forkJoin } from 'rxjs';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { CommentActionType } from '../../../shared/enums/comment-action-type.enum';
import {
  AddComment,
  CommentAction,
  CommentActionResult,
} from '../../../shared/models/comment-upsert.model';
import { Post } from '../../../shared/models/post.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';
import { CommentFormComponent } from '../components/comment-form/comment-form.component';
import { PostCommentsComponent } from '../components/post-comments/post-comments.component';
import { PostCommentsService } from '../services/post-comments.service';

@Pipe({ name: 'customHtml', standalone: true })
export class CustomHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value?: string): string | null {
    if (value == null) {
      return null;
    }

    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }
}

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    CustomHtmlPipe,
    PostCommentsComponent,
    CommentFormComponent,
    TranslateModule,
    LanguageSelectorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailsComponent implements OnInit {
  private readonly postId: number;

  readonly commentAction: CommentAction = { type: CommentActionType.add };
  readonly isAddingComment = signal(false);
  readonly isLoading = signal(true);
  readonly comments = this.postCommentsService.comments;

  postDetails = signal<Post | undefined>(undefined);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly postsHttpService: PostsHttpService,
    private readonly postCommentsService: PostCommentsService
  ) {
    this.postId = this.getPostIdFromRoute();
  }

  ngOnInit() {
    forkJoin({
      postDetails: this.postsHttpService.getPostDetails$(this.postId),
      comments: this.postsHttpService.getPostComments$(this.postId),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(({ postDetails, comments }) => {
        this.postDetails.set(postDetails);
        this.postCommentsService.comments = comments;
      });
  }

  addComment(result: CommentActionResult): void {
    if (result.user == null) {
      return;
    }

    const comment: AddComment = {
      user: result.user,
      content: result.content,
    };
    this.postCommentsService
      .addComment(this.postId, comment)
      .subscribe(() => this.isAddingComment.set(false));
  }

  private getPostIdFromRoute(): number {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id == null || isNaN(parseInt(id))) {
      this.router.navigateByUrl('');
      throw new Error('Invalid identifier route parameter');
    }

    return parseInt(id);
  }
}
