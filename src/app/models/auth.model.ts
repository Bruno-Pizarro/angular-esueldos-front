import { UserRoles } from 'src/app/models/user.model';

export interface IRegisterState {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}
export type IRegisterHideState = {
  [key in keyof IRegisterState]?: boolean;
};
export interface IInputProps<T> {
  label: string;
  name: keyof T;
  hide?: boolean;
  type?: string;
  placeholder?: string;
  disableError?: boolean;
}

export interface ILoginState {
  email: string;
  password: string;
}
export type ILoginHideState = {
  [key in keyof ILoginState]?: boolean;
};

export type IGenericHideState<T> = {
  [key in keyof T]?: boolean;
};

export interface IEditUser {
  email: string;
  password: string;
  name: string;
}

export type IEditHideState = {
  [key in keyof IEditUser]?: boolean;
};
export interface ICreateUser {
  email: string;
  password: string;
  name: string;
  role: `${UserRoles}`;
}

export type ICreateHideState = {
  [key in keyof ICreateUser]?: boolean;
};
