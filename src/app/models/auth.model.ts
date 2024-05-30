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
}

export interface ILoginState {
  email: string;
  password: string;
}
export type ILoginHideState = {
  [key in keyof ILoginState]?: boolean;
};

export interface IEditUser {
  email: string;
  password: string;
  name: string;
}

export type IEditHideState = {
  [key in keyof IEditUser]?: boolean;
};
