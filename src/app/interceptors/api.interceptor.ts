import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { StorageKeys } from 'src/app/constants';
import { CookiesService, AuthService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private cookies: CookiesService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.cookies.getItem(StorageKeys.TOKEN);
    if (!token) this.authService.logOut();
    const apiReq = req.clone({
      url: `${environment.BASE_URL}/${req.url}`,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.router.navigate(['/auth/unauthorized']);
        }
        return throwError(error);
      })
    );
  }
}
