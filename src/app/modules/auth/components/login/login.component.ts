import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginHideState, ILoginState } from 'src/app/models';
import { AuthComponent } from 'src/app/modules/auth/auth.component';
import { ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: '../../auth.component.html',
})
export class LoginComponent extends AuthComponent {
  override form = this.fb.group<{ [key in keyof ILoginState]: any }>({
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });
  @Input() override user: ILoginState = {
    email: '',
    password: '',
  };

  override hide: ILoginHideState = {
    password: true,
  };

  constructor(
    router: Router,
    authService: AuthService,
    validationService: ValidationService
  ) {
    super(router, authService, validationService);
    this.mainAction = 'Log In';
    this.altAction = 'or Register';
    this.altPath = '/auth/register';
    this.title = 'Sign In';
  }

  protected override updateInputProps() {
    this.inputProps = [
      { label: 'Email', name: 'email' },
      {
        label: 'Password',
        name: 'password',
        hide: this.hide.password,
      },
    ];
  }
  override onSubmit(): void {
    if (this.form.value && this.form.valid) {
      this.authService.signIn(this.form.value as ILoginState);
    }
  }
}
