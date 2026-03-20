import { z } from "zod";

export const itemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or fewer."),
  available: z.boolean(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
