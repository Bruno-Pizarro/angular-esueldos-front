import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { StorageKeys } from 'src/app/constants';
import { ILoginState, IRegisterState } from 'src/app/models';
import { IAuthResponse, IUser } from '../../models/user.model';
import { CookiesService } from 'src/app/services/cookies';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: IUser | null = null;
  private currentUserSubject: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);
  public currentUser$: Observable<IUser | null> =
    this.currentUserSubject.asObservable();
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private cookies: CookiesService
  ) {}
  popupError({ error, message }: HttpErrorResponse) {
    const msg = error?.message ?? message;
    this.toastr.error(msg);
    return throwError(() => new Error(msg));
  }

  setStoreKeys({ tokens }: IAuthResponse) {
    this.cookies.setItem(
      StorageKeys.TOKEN,
      tokens.access.token,
      tokens.access.expires
    );
    this.cookies.setItem(
      StorageKeys.R_TOKEN,
      tokens.refresh.token,
      tokens.refresh.expires
    );
  }
  removeStoreKeys() {
    this.cookies.removeItem(StorageKeys.TOKEN);
    this.cookies.removeItem(StorageKeys.R_TOKEN);
  }

  signIn(data: ILoginState) {
    this.http.post<IAuthResponse>('auth/login', data).subscribe({
      next: (res) => {
        this.setStoreKeys(res);
        this.currentUser = res.user;
        this.toastr.success('Successfully logged in');
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => this.popupError(err),
    });
  }

  signUp(data: IRegisterState) {
    const { repeatPassword, ...restOfData } = data;
    return this.http.post('auth/register', restOfData).subscribe({
      next: () => {
        this.toastr.success('Registration successfully');
        this.router.navigate(['auth/login']);
      },
      error: (err: HttpErrorResponse) => this.popupError(err),
    });
  }

  logOut() {
    if (this.currentUser) this.toastr.warning('Logged out');
    this.cookies.removeItem(StorageKeys.TOKEN);
    this.cookies.removeItem(StorageKeys.R_TOKEN);
    this.currentUser = null;
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const rToken = this.cookies.getItem(StorageKeys.R_TOKEN);
    return this.http
      .post<IAuthResponse>('auth/refresh-tokens', {
        refreshToken: rToken,
      })
      .subscribe({
        next: (res) => {
          const { user } = res;
          this.setStoreKeys(res);
          this.currentUser = user;
          this.currentUserSubject.next(user);
          return user;
        },
      });
  }

  loadUser() {
    const rToken = this.cookies.getItem(StorageKeys.R_TOKEN);
    return this.http.post<IAuthResponse>('auth/refresh-tokens', {
      refreshToken: rToken,
    });
  }

  checkTokenExp() {
    const exp = this.cookies.getItemExpiration(StorageKeys.TOKEN);
    if (!exp) return false;
    const expToDate = new Date(exp);
    const minutesDifference =
      Math.abs(expToDate.getTime() - new Date().getTime()) / 60000;

    return minutesDifference < 15;
  }

  checkLogin() {
    const exp = this.cookies.getItemExpiration(StorageKeys.TOKEN);
    const token = this.cookies.getItem(StorageKeys.TOKEN);
    const rToken = this.cookies.getItem(StorageKeys.R_TOKEN);
    return (
      exp && token && rToken && new Date(exp).getTime() > new Date().getTime()
    );
  }
}
