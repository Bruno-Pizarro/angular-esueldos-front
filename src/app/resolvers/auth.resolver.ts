import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IUser } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router) {}
  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<IUser | null | undefined> {
    try {
      const response = await this.authService.loadUser().toPromise();
      if (!response) return null;
      const { user } = response;
      this.authService.setStoreKeys(response);
      this.authService.refreshToken();
      let currentRoute = route;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      const expectedRole =
        currentRoute.data['expectedRole'] || route.data['expectedRole'];
      if (expectedRole && user?.role && user?.role !== expectedRole) {
        this.router.navigate(['auth/unauthorized']);
        return user;
      }
      return user;
    } catch (error) {
      return null;
    }
  }
}
