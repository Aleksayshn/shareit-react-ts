import { apiClient } from "@/src/shared/api";
import {
  mapCommentDraftToCreateCommentRequest,
  mapCommentDtoToComment,
  type CommentDraft,
  type CommentDto,
} from "../model/comment";

export async function addComment(itemId: string, draft: CommentDraft) {
  const comment = await apiClient.post<CommentDto, { text: string }>(
    `/items/${itemId}/comment`,
    mapCommentDraftToCreateCommentRequest(draft),
  );

  return mapCommentDtoToComment(comment);
}
