import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { StorageKeys } from 'src/app/constants';
import { ILoginState, IRegisterState } from 'src/app/models';
import { IAuthResponse, IUser } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: IUser | null = null;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}
  popupError({ error, message }: HttpErrorResponse) {
    const msg = error?.message ?? message;
    this.toastr.error(msg);
    return throwError(() => new Error(msg));
  }

  setStoreKeys({ tokens }: IAuthResponse) {
    localStorage.setItem(StorageKeys.EXP, tokens.access.expires);
    localStorage.setItem(StorageKeys.TOKEN, tokens.access.token);
    localStorage.setItem(StorageKeys.R_TOKEN, tokens.refresh.token);
  }
  removeStoreKeys() {
    localStorage.removeItem(StorageKeys.EXP);
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.R_TOKEN);
  }

  signIn(data: ILoginState) {
    this.http.post<IAuthResponse>('auth/login', data).subscribe({
      next: (res) => {
        this.setStoreKeys(res);
        this.currentUser = res.user;
        this.toastr.success('Successfully logged in');
        this.router.navigate(['/home']);
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
    localStorage.removeItem(StorageKeys.EXP);
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.R_TOKEN);
    this.currentUser = null;
    this.router.navigate(['/auth/login']);
  }

  refreshToken() {
    const rToken = localStorage.getItem(StorageKeys.R_TOKEN);
    return this.http
      .post<IAuthResponse>('auth/refresh-tokens', {
        refreshToken: rToken,
      })
      .subscribe({
        next: (res) => {
          const { tokens, user } = res;
          localStorage.setItem(StorageKeys.EXP, tokens.access.expires);
          localStorage.setItem(StorageKeys.TOKEN, tokens.access.token);
          localStorage.setItem(StorageKeys.R_TOKEN, tokens.refresh.token);
          this.currentUser = user;
        },
      });
  }

  checkTokenExp() {
    const exp = localStorage.getItem(StorageKeys.EXP);
    if (!exp) return false;
    const expToDate = new Date(exp);
    const minutesDifference =
      Math.abs(expToDate.getTime() - new Date().getTime()) / 60000;

    return minutesDifference < 15;
  }

  checkLogin() {
    const exp = localStorage.getItem(StorageKeys.EXP);
    const token = localStorage.getItem(StorageKeys.TOKEN);
    const rToken = localStorage.getItem(StorageKeys.R_TOKEN);
    return (
      exp && token && rToken && new Date(exp).getTime() > new Date().getTime()
    );
  }
}
