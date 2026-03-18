import type { Comment } from "@/src/entities/comment";

export interface Item {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  requestId: number | null;
  comments: Comment[];
}

export interface ItemDraft {
  name: string;
  description: string;
  available: boolean;
}

export const emptyItemDraft: ItemDraft = {
  name: "",
  description: "",
  available: true,
};
