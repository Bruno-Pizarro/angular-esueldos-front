import { Component, inject, Inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  GenericOption,
  ICreateHideState,
  ICreateUser,
  IInputProps,
  IUser,
  UserRoles,
} from 'src/app/models';
import { UsersService, ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'create-dialog',
  templateUrl: './create-dialog.component.html',
})
export class CreateUserDialog implements OnInit {
  fb = inject(NonNullableFormBuilder);
  user!: IUser;
  role?: `${UserRoles}`;
  passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/;
  inputProps: IInputProps<ICreateUser>[] = [];
  roles: GenericOption<`${UserRoles}`>[] = [
    { value: UserRoles.admin, label: 'Admin' },
    { value: UserRoles.user, label: 'User' },
  ];

  constructor(
    public authService: AuthService,
    private userService: UsersService,
    public validationService: ValidationService,
    public dialogRef: MatDialogRef<CreateUserDialog>,
    @Inject(MAT_DIALOG_DATA) public id: string
  ) {}

  ngOnInit() {
    this.updateInputProps();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  async saveUser() {
    if (this.form.valid && this.form.value) {
      await this.userService.createUser({ ...this.form.value } as ICreateUser);
      this.form.reset({ email: '', name: '', password: '', role: '' });
      this.form.clearValidators();
    }
  }

  //uip
  hide: ICreateHideState = {
    password: true,
  };

  protected updateInputProps() {
    this.inputProps = [
      { label: 'Name', name: 'name' },
      { label: 'Email', name: 'email' },
      {
        label: 'Role',
        name: 'role',
        type: 'select',
      },
      {
        label: 'Password',
        name: 'password',
        hide: this.hide.password,
      },
    ];
  }

  //capip
  form = this.fb.group<{ [key in keyof ICreateUser]: any }>({
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
    role: this.fb.control('', {
      validators: [Validators.required],
    }),
  });

  public hideButton(input: IInputProps<ICreateUser>) {
    this.hide[input.name] = !this.hide[input.name];
    this.updateInputProps();
  }
}
