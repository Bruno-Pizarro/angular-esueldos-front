import { Component, inject, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IEditHideState,
  IEditUser,
  IInputProps,
  IUser,
  UserRoles,
} from 'src/app/models';
import { UsersService, ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'dialog-overview',
  templateUrl: './edit-dialog.component.html',
})
export class EditUserDialog implements OnInit {
  fb = inject(NonNullableFormBuilder);
  user!: IUser;
  role?: `${UserRoles}`;
  edit: boolean = false;
  passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/;
  inputProps: IInputProps<IEditUser>[] = [];

  constructor(
    public authService: AuthService,
    private userService: UsersService,
    public validationService: ValidationService,
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) {
    this.loadUser();
    this.role = authService.currentUser?.role;
  }

  checkRole(): boolean {
    if (this.user.role === 'admin')
      return this.user.id === this.authService.currentUser?.id;
    return this.role === 'admin';
  }

  async loadUser() {
    this.user = await this.userService.getUserByID(this.id);
    this.form.patchValue({
      email: this.user.email,
      name: this.user.name,
      password: '',
    });
  }
  ngOnInit() {
    this.updateInputProps();
  }

  editUser(): void {
    this.edit = !this.edit;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  async saveUser() {
    if (this.form.valid && this.form.value) {
      await this.userService.editUser(
        { ...this.form.value } as IEditUser,
        this.id
      );
      this.editUser();
      this.loadUser();
      this.form.reset();
    }
  }

  //uip
  hide: IEditHideState = {
    password: true,
  };

  protected updateInputProps() {
    this.inputProps = [
      { label: 'Name', name: 'name' },
      { label: 'Email', name: 'email' },
      {
        label: 'Password',
        name: 'password',
        hide: this.hide.password,
      },
    ];
  }

  //capip
  form = this.fb.group<{ [key in keyof IEditUser]: any }>({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    name: this.fb.control('', {
      validators: [Validators.required, Validators.maxLength(16)],
    }),
    password: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordRegex),
      ],
    }),
  });

  public hideButton(input: IInputProps<IEditUser>) {
    this.hide[input.name] = !this.hide[input.name];
    this.updateInputProps();
  }
}
