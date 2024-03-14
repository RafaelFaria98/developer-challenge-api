import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommentActionType } from '../../../../shared/enums/comment-action-type.enum';
import {
  CommentAction,
  CommentActionResult,
} from '../../../../shared/models/comment-upsert.model';

interface CommentForm {
  user?: FormControl<string>;
  content: FormControl<string>;
}

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
})
export class CommentFormComponent {
  @Input({ required: true }) set action(action: CommentAction | undefined) {
    if (action == null) {
      return;
    }

    this.actionType = action.type;
    switch (action.type) {
      case CommentActionType.edit:
        this.title = this.translate.instant('editComment');
        this.form.controls.content.setValue(action.content ?? '');
        return;
      case CommentActionType.reply:
        this.title = this.translate.instant('replyComment');
        this.addUserFormControl();
        return;
      case CommentActionType.add:
      default:
        this.title = this.translate.instant('addNewComment');
        this.addUserFormControl();
        return;
    }
  }

  @Output() submitEvent = new EventEmitter<CommentActionResult>();
  @Output() cancelEvent = new EventEmitter<void>();

  readonly commentActionType = CommentActionType;

  title = this.translate.instant('addNewComment');
  actionType = CommentActionType.add;
  form: FormGroup<CommentForm>;

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly translate: TranslateService
  ) {
    this.form = this.formBuilder.group<CommentForm>({
      content: this.formBuilder.control<string>('', {
        validators: Validators.required,
      }),
    });
  }

  handleSubmit(): void {
    const result: CommentActionResult = {
      content: this.form.controls.content.value,
      user: this.form.controls.user?.value,
    };
    this.submitEvent.emit(result);
    this.form.reset();
  }

  handleCancel(): void {
    this.cancelEvent.emit();
  }

  private addUserFormControl(): void {
    const control = this.formBuilder.control<string>('', {
      validators: Validators.required,
    });
    this.form.addControl('user', control);
  }
}
