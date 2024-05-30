export interface IUser {
  id: string;
  name: string;
  email: string;
  role: `${UserRoles}`;
  isEmailVerified?: boolean;
}

export interface IUsersResponse {
  results: IUser[];
  page: number;
  limit: number;
  totalPages: number;
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
