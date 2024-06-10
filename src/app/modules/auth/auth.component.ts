import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Route, Router } from '@angular/router';
import {
  IInputProps,
  ILoginHideState,
  ILoginState,
  IRegisterHideState,
  IRegisterState,
} from 'src/app/models';
import { ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({ template: '' })
export abstract class AuthComponent implements OnInit {
  //binds
  @Input() user!: ILoginState | IRegisterState;

  //privm
  protected abstract updateInputProps(): void;

  //uip
  fb = inject(NonNullableFormBuilder);
  hide!: ILoginHideState & IRegisterHideState;
  inputProps: IInputProps<ILoginState & IRegisterState>[] = [];
  title!: string;
  mainAction!: string;
  altAction!: string;
  altPath!: string;

  //capip
  form!: FormGroup;
  route!: Route;
  passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$/;

  constructor(
    private router: Router,
    public authService: AuthService,
    public validationService: ValidationService
  ) {}

  //lc
  ngOnInit() {
    if (this.authService.checkLogin()) {
      this.router.navigate(['/products']);
    }
    this.updateInputProps();
  }

  //evha
  public onChange(event: Event) {
    const { value, name } = event.target as HTMLInputElement;
    this.user = {
      ...this.user,
      [name]: value,
    };
    this.updateInputProps();
  }

  public hideButton(input: IInputProps<ILoginState & IRegisterState>) {
    this.hide[input.name] = !this.hide[input.name];
    this.updateInputProps();
  }

  public abstract onSubmit(): void;

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
