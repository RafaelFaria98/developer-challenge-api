import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommentActionType } from '../../../../shared/enums/comment-action-type.enum';
import { CommentFormComponent } from './comment-form.component';

const translateServiceStub = {
  instant: (key: string) => key,
};

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommentFormComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    }).overrideTemplate(CommentFormComponent, '');

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate initial values', () => {
    expect(component.title).toEqual('addNewComment');
    expect(component.actionType).toEqual(CommentActionType.add);
    expect(component.form.controls.content.value).toEqual('');
    expect(
      component.form.controls.content.hasValidator(Validators.required)
    ).toBeTruthy();
  });

  it('should set action', () => {
    component.action = { type: CommentActionType.edit, content: 'content' };
    expect(component.title).toEqual('editComment');
    expect(component.form.controls.content.value).toEqual('content');

    component.action = { type: CommentActionType.reply };
    expect(component.title).toEqual('replyComment');
    expect(component.form.controls.user).toBeDefined();
    expect(component.form.controls.user?.value).toEqual('');
    expect(
      component.form.controls.user?.hasValidator(Validators.required)
    ).toBeTruthy();

    component.action = { type: CommentActionType.add };
    expect(component.title).toEqual('addNewComment');
    expect(component.form.controls.user).toBeDefined();
    expect(component.form.controls.user?.value).toEqual('');
    expect(
      component.form.controls.user?.hasValidator(Validators.required)
    ).toBeTruthy();
  });

  it('should handle submit', () => {
    jest.spyOn(component.submitEvent, 'emit');
    jest.spyOn(component.form, 'reset');

    component.handleSubmit();

    expect(component.submitEvent.emit).toHaveBeenCalledWith({
      content: component.form.controls.content.value,
      user: component.form.controls.user?.value,
    });
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should handle cancel', () => {
    jest.spyOn(component.cancelEvent, 'emit');

    component.handleCancel();

    expect(component.cancelEvent.emit).toHaveBeenCalled();
  });
});
