export interface IUser {
  id: string;
  name: string;
  email: string;
  role: `${UserRoles}`;
  isEmailVerified?: boolean;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}

export interface IAuthResponse {
  user: IUser;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}
