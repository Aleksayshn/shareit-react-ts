import { apiClient } from "@/src/shared/api";
import {
  mapCreateUserInputToRequest,
  mapUpdateUserInputToRequest,
  mapUserDtoToUser,
  type CreateUserInput,
  type CreateUserRequestDto,
  type UpdateUserInput,
  type UpdateUserRequestDto,
  type UserDto,
} from "../model";

export async function getUsers() {
  const users = await apiClient.get<UserDto[]>("/users");

  return users.map(mapUserDtoToUser);
}

export async function getUser(userId: string) {
  const user = await apiClient.get<UserDto>(`/users/${userId}`);

  return mapUserDtoToUser(user);
}

export async function createUser(input: CreateUserInput) {
  const user = await apiClient.post<UserDto, CreateUserRequestDto>(
    "/users",
    mapCreateUserInputToRequest(input),
  );

  return mapUserDtoToUser(user);
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  const user = await apiClient.patch<UserDto, UpdateUserRequestDto>(
    `/users/${userId}`,
    mapUpdateUserInputToRequest(input),
  );

  return mapUserDtoToUser(user);
}

export async function deleteUser(userId: string) {
  await apiClient.delete<void>(`/users/${userId}`);
}
