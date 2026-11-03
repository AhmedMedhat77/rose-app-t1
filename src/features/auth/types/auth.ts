export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export type ROLE = UserRole;

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender?: GENDER;
  photo?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
