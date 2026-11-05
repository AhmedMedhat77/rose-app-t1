export enum ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

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
  role: ROLE;
  createdAt: string;
  updatedAt: string;
}
