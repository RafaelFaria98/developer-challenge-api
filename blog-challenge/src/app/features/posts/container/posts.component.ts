import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime } from 'rxjs';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { Post } from '../../../shared/models/post.model';
import { PostsHttpService } from '../../../shared/services/posts-http.service';
import { PostComponent } from '../components/post/post.component';

@Directive({ selector: '[quickSearch]', standalone: true })
export class QuickSearchDirective implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputChanged = new Subject<string | undefined>();

  @Output() valueChanged = new EventEmitter<string | undefined>();

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.inputChanged.next(value === '' ? undefined : value);
  }

  ngOnInit(): void {
    this.inputChanged
      .asObservable()
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe((item) => this.valueChanged.emit(item));
  }

  ngOnDestroy(): void {
    this.inputChanged.complete();
  }
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    PostComponent,
    QuickSearchDirective,
    FormsModule,
    TranslateModule,
    LanguageSelectorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent implements OnInit {
  readonly posts = signal<Post[]>([]);

  allPosts: Post[] = [];

  constructor(private readonly postsHttpService: PostsHttpService) {}

  ngOnInit(): void {
    this.postsHttpService.getPosts$().subscribe((item) => {
      this.allPosts = item;
      this.posts.set(item);
    });
  }

  filterPosts(title: string | undefined): void {
    if (!title) {
      this.posts.set(this.allPosts);
      return;
    }

    const posts = this.allPosts.filter((item) =>
      item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
    );
    this.posts.set(posts);
  }
}
