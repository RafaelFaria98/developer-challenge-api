import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Language } from '../../../core/language/enums/language.enum';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectorComponent {
  @Input() backButton = false;

  readonly language = Language;

  selectedLanguage = this.activatedRoute.snapshot.paramMap.get(
    'lang'
  ) as Language;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  changeLanguage(lang: Language) {
    const url = this.router.url.replace(this.selectedLanguage, lang);

    this.router.navigateByUrl(url);
    this.selectedLanguage = lang;
  }

  navigateToPosts(): void {
    this.router.navigateByUrl(`${this.selectedLanguage}/posts`);
  }
}
