export type UserRole = "buyer" | "seller";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;

  specialty?: string;
  location?: string;
  bio?: string;
  image?: string;
  phone?: string;

  createdAt?: Date;
  updatedAt?: Date;
}