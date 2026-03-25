import type { AuthSession } from "@/src/shared/auth";
import type { AuthResponseDto } from "./auth.types";

export function mapAuthResponseToSession(dto: AuthResponseDto): AuthSession {
  return {
    user: {
      id: String(dto.id),
      name: dto.name,
      email: dto.email,
    },
    token: dto.token,
  };
}

export function mapAuthResponseToUser(dto: AuthResponseDto) {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
  };
}
