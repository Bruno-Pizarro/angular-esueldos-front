import { Component, inject, Inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEditUser, IUser, UserRoles } from 'src/app/models';
import { UsersService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.component.html',
})
export class DeleteUserDialog {
  fb = inject(NonNullableFormBuilder);
  form = this.fb.group<{ [key in keyof IEditUser]: any }>({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: '',
    name: '',
  });
  user!: IUser;
  role?: `${UserRoles}`;
  edit: boolean = false;
  constructor(
    authService: AuthService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<DeleteUserDialog>,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) {
    this.loadUser();
    this.role = authService.currentUser?.role;
  }

  async loadUser() {
    this.user = await this.userService.getUserByID(this.id);
  }

  editUser(): void {
    this.edit = !this.edit;
  }

  async deleteUser() {
    await this.userService.deleteUser(this.id);
    this.dialogRef.close(true);
  }
}
