import type { User } from "./user";
import type { CreateUserInput, UpdateUserInput } from "./user.types";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserDto,
} from "./user.types";

export function mapUserDtoToUser(dto: UserDto): User {
  return {
    id: String(dto.id),
    name: dto.name,
    email: dto.email,
  };
}

export function mapCreateUserInputToRequest(
  input: CreateUserInput,
): CreateUserRequestDto {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
  };
}

export function mapUpdateUserInputToRequest(
  input: UpdateUserInput,
): UpdateUserRequestDto {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
  };
}
