import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Language } from '../../../core/language/enums/language.enum';
import { LanguageSelectorComponent } from './language-selector.component';

describe('LanguageSelectorComponent', () => {
  let router: Router;
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [
        Router,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => 'pt' },
            },
          },
        },
      ],
    }).overrideTemplate(LanguageSelectorComponent, '');

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate selected language', () => {
    expect(component.selectedLanguage).toEqual(Language.pt);
  });

  it('should change language', () => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/pt/posts');
    jest.spyOn(router, 'navigateByUrl').mockImplementation(jest.fn());

    component.changeLanguage(Language.en);

    expect(router.navigateByUrl).toHaveBeenCalledWith('/en/posts');
    expect(component.selectedLanguage).toEqual(Language.en);
  });

  it('should navigate to posts list', () => {
    jest.spyOn(router, 'navigateByUrl').mockImplementation(jest.fn());

    component.navigateToPosts();

    expect(router.navigateByUrl).toHaveBeenCalledWith(
      `${component.selectedLanguage}/posts`
    );
  });
});
