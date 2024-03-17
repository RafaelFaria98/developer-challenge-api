import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommentActionType } from '../../../../shared/enums/comment-action-type.enum';
import { PostCommentsService } from '../../services/post-comments.service';
import { PostCommentComponent } from './post-comment.component';

const postCommentsServiceStub = {
  editComment: () => of(),
  addComment: () => of(),
};

describe('PostCommentComponent', () => {
  let postCommentsService: PostCommentsService;
  let component: PostCommentComponent;
  let fixture: ComponentFixture<PostCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostCommentComponent],
      providers: [
        { provide: PostCommentsService, useValue: postCommentsServiceStub },
      ],
    }).overrideTemplate(PostCommentComponent, '');

    postCommentsService = TestBed.inject(PostCommentsService);
    fixture = TestBed.createComponent(PostCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.comment = {
      id: 1,
      parent_id: 1,
      content: 'content',
      date: new Date(),
      postId: 1,
      replies: [],
      user: 'user',
    };
  });

  it('should validate initial values', () => {
    expect(component.isEditing()).toBeFalsy();
    expect(component.isReplying()).toBeFalsy();
    expect(component.commentAction).toBeUndefined();
  });

  it('should start edit', () => {
    component.startEdit();

    expect(component.isEditing()).toBeTruthy();
    expect(component.commentAction).toEqual({
      type: CommentActionType.edit,
      content: component.comment.content,
    });
  });

  it('should start reply', () => {
    component.startReply();

    expect(component.isReplying()).toBeTruthy();
    expect(component.commentAction).toEqual({ type: CommentActionType.reply });
  });

  it('should handle edit submit', waitForAsync(() => {
    jest.spyOn(postCommentsService, 'editComment');
    component.commentAction = { type: CommentActionType.edit };

    component.handleSubmit({ content: 'new content' });

    expect(postCommentsService.editComment).toHaveBeenCalledWith(
      component.comment.postId,
      {
        id: component.comment.id,
        user: component.comment.user,
        parent_id: component.comment.parent_id,
        content: 'new content',
      }
    );
    expect(component.isEditing()).toBeFalsy();
    expect(component.commentAction).toBeUndefined();
  }));

  it('should handle reply submit', () => {
    jest.spyOn(postCommentsService, 'addComment');
    component.commentAction = { type: CommentActionType.reply };

    component.handleSubmit({ content: 'content', user: 'user' });

    expect(postCommentsService.addComment).toHaveBeenCalledWith(
      component.comment.postId,
      {
        user: 'user',
        parent_id: component.comment.id,
        content: 'content',
      }
    );
    expect(component.isReplying()).toBeFalsy();
    expect(component.commentAction).toBeUndefined();
  });

  it('should handle cancel', () => {
    component.isEditing.set(true);
    component.isReplying.set(true);

    component.commentAction = { type: CommentActionType.edit };
    component.handleCancel();
    expect(component.isEditing()).toBeFalsy();
    expect(component.commentAction).toBeUndefined();

    component.commentAction = { type: CommentActionType.reply };
    component.handleCancel();
    expect(component.isReplying()).toBeFalsy();
    expect(component.commentAction).toBeUndefined();
  });
});
