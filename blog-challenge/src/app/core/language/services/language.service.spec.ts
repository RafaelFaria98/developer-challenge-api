import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../enums/language.enum';
import { LanguageService } from './language.service';

const translateServiceStub = {
  setDefaultLang: jest.fn(),
  use: jest.fn(),
  addLangs: jest.fn(),
  getLangs: jest.fn(),
};

describe('LanguageService', () => {
  let service: LanguageService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateServiceStub },
      ],
    });

    service = TestBed.inject(LanguageService);
    translate = TestBed.inject(TranslateService);
  });

  it('should initialize', () => {
    jest.spyOn(translate, 'setDefaultLang');
    jest.spyOn(translate, 'addLangs');

    service.initialize();

    expect(translate.addLangs).toHaveBeenCalledWith([Language.en, Language.pt]);
    expect(translate.setDefaultLang).toHaveBeenCalledWith(Language.en);
  });

  it('should set language', () => {
    jest.spyOn(translate, 'use');

    service.setLanguage(Language.pt);

    expect(translate.use).toHaveBeenCalledWith(Language.pt);
  });

  it('should validate supported languages', () => {
    jest
      .spyOn(translate, 'getLangs')
      .mockReturnValue([Language.en, Language.pt]);

    expect(service.hasLanguage(Language.pt)).toBeTruthy();
    expect(service.hasLanguage('es' as Language)).toBeFalsy();
  });
});
