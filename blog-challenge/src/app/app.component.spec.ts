import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LanguageService } from './core/language/services/language.service';

export const languageServiceStub = {
  initialize: jest.fn(),
};

describe('AppComponent', () => {
  let languageService: LanguageService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: LanguageService, useValue: languageServiceStub }],
    }).overrideTemplate(AppComponent, '');

    languageService = TestBed.inject(LanguageService);

    jest.spyOn(languageService, 'initialize');
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize language', () => {
    expect(languageService.initialize).toHaveBeenCalled();
  });
});
