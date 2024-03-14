import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../enums/language.enum';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private readonly translateService: TranslateService) {}

  initialize(): void {
    this.translateService.addLangs([Language.en, Language.pt]);
    this.translateService.setDefaultLang(Language.en);
  }

  setLanguage(language: Language): void {
    this.translateService.use(language);
  }

  hasLanguage(language: Language): boolean {
    return this.translateService.getLangs().some((item) => item == language);
  }
}
