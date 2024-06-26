import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ICreateUser, IEditUser, IListResponse, IUser } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersUpdatedSubject = new BehaviorSubject<void>(undefined);
  public usersUpdated$ = this.usersUpdatedSubject.asObservable();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  async getUsers(page: number = 1, sortBy: string = 'name:asc') {
    const response = await firstValueFrom(
      this.http.get<IListResponse<IUser>>(
        `users?page=${page}${sortBy ? `&sortBy=${sortBy}` : ''}`
      )
    );
    return response;
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

  async createUser(user: ICreateUser) {
    return await firstValueFrom(this.http.post(`users`, user))
      .then(() => {
        this.usersUpdatedSubject.next();
        this.toastr.success('User created');
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
