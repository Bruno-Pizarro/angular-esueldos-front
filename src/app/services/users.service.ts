import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { IEditUser, IUser, IUsersResponse } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUpdatedSubject = new BehaviorSubject<void>(undefined);
  public usersUpdated$ = this.usersUpdatedSubject.asObservable();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  async getUsers() {
    return (await firstValueFrom(this.http.get<IUsersResponse>('users')))
      .results;
  }

  async getUserByID(id: string): Promise<IUser> {
    return await firstValueFrom(this.http.get<IUser>(`users/${id}`));
  }

  async editUser(user: IEditUser, id: string) {
    return await firstValueFrom(this.http.patch(`users/${id}`, user))
      .then(() => {
        this.usersUpdatedSubject.next();
        this.toastr.success('User updated');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async deleteUser(id: string) {
    return await firstValueFrom(this.http.delete(`users/${id}`))
      .then(() => {
        this.usersUpdatedSubject.next();
        this.toastr.success('User deleted');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }
}
