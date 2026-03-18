import type { CommentDto } from "@/src/entities/comment";

export interface ItemDto {
  id: number;
  name: string;
  description: string;
  available: boolean;
  requestId?: number | null;
  comments?: CommentDto[];
}

export interface CreateItemRequestDto {
  name: string;
  description: string;
  available: boolean;
}

export interface UpdateItemRequestDto {
  name?: string;
  description?: string;
  available?: boolean;
}
