export interface CommentDto {
  id: number;
  text: string;
  authorName: string;
  created: string;
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export interface CommentDraft {
  text: string;
}

export interface CreateCommentRequestDto {
  text: string;
}

export function mapCommentDtoToComment(dto: CommentDto): Comment {
  return {
    id: String(dto.id),
    text: dto.text,
    authorName: dto.authorName,
    createdAt: dto.created,
  };
}

export function mapCommentDraftToCreateCommentRequest(
  draft: CommentDraft,
): CreateCommentRequestDto {
  return {
    text: draft.text.trim(),
  };
}
