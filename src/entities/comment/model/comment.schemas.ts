import { z } from "zod";

export const commentFormSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Comment text is required.")
    .max(1000, "Comment must be 1000 characters or fewer."),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
