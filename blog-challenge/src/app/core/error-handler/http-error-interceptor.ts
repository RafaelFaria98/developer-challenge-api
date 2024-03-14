import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle HTTP errors by give some feedback to the user for example
      if (
        window.confirm('Something went wrong. Please try to refresh the page')
      ) {
        window.location.href = '/';
      }
      return throwError(() => error);
    })
  );
};
