import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterHideState, IRegisterState } from 'src/app/models';
import { AuthComponent } from 'src/app/modules/auth/auth.component';
import { ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: '../../auth.component.html',
})
export class RegisterComponent extends AuthComponent {
  //binds
  @Input() override user: IRegisterState = {
    email: '',
    password: '',
    name: '',
    repeatPassword: '',
  };

  //uip
  override hide: IRegisterHideState = {
    password: true,
    repeatPassword: true,
  };

  //privm
  private checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let rPass = group.get('repeatPassword')?.value;
    if (pass !== rPass)
      group.get('repeatPassword')?.setErrors({ notSame: true });
    return pass === rPass ? null : { notSame: true };
  };

  protected override updateInputProps() {
    this.inputProps = [
      { label: 'Name', name: 'name' },
      { label: 'Email', name: 'email' },
      {
        label: 'Password',
        name: 'password',
        hide: this.hide.password,
      },
      {
        label: 'Confirm password',
        name: 'repeatPassword',
        hide: this.hide.repeatPassword,
      },
    ];
  }

  //capip
  override form = this.fb.group<{ [key in keyof IRegisterState]: any }>(
    {
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
      repeatPassword: this.fb.control('', {
        validators: [Validators.required],
      }),
    },
    { validators: this.checkPasswords }
  );

  constructor(
    router: Router,
    authService: AuthService,
    validationService: ValidationService
  ) {
    super(router, authService, validationService);
    this.mainAction = 'Register';
    this.altAction = 'or Log In';
    this.altPath = '/auth/login';
    this.title = 'Sign Up';
  }

  //evha
  override onSubmit(): void {
    if (this.form.value && this.form.valid) {
      this.authService.signUp(this.form.value as IRegisterState);
    }
  }
}
