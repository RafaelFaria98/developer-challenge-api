import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  Routes,
} from '@angular/router';
import { Language } from './core/language/enums/language.enum';
import { LanguageService } from './core/language/services/language.service';
import { PostDetailsComponent } from './features/post-details/container/post-details.component';
import { PostsComponent } from './features/posts/container/posts.component';

const langGuard: CanActivateFn = (
  activatedRoute: ActivatedRouteSnapshot
): boolean => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  const routeLang = activatedRoute.paramMap.get('lang') as Language;
  if (routeLang == null || !languageService.hasLanguage(routeLang)) {
    languageService.setLanguage(Language.en);
    router.navigateByUrl('/');
  } else {
    languageService.setLanguage(routeLang);
  }

  return true;
};

export const routes: Routes = [
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        redirectTo: 'posts',
        pathMatch: 'full',
      },
      {
        path: 'posts',
        children: [
          {
            path: '',
            loadComponent: () => PostsComponent,
          },
          {
            path: ':id/:slug',
            loadComponent: () => PostDetailsComponent,
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'en/posts',
  },
];
