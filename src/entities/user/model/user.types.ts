import type { User } from "./user";

export interface UserDto {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequestDto {
  name: string;
  email: string;
}

export interface UpdateUserRequestDto {
  name?: string;
  email?: string;
}

export type CreateUserInput = Pick<User, "name" | "email">;
export type UpdateUserInput = Pick<User, "name" | "email">;
