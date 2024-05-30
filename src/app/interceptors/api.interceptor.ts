import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageKeys } from 'src/app/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (!token) this.authService.logOut();
    const apiReq = req.clone({
      url: `${environment.BASE_URL}/${req.url}`,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(apiReq);
  }
}
