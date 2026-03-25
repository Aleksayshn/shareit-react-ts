import type { AuthUser } from "@/src/shared/auth";

export interface AuthResponseDto {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export type AuthUserResponse = AuthUser;
