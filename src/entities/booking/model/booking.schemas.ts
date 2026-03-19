import { z } from "zod";

export const bookingFormSchema = z
  .object({
    startAt: z.string().min(1, "Start time is required."),
    endAt: z.string().min(1, "End time is required."),
  })
  .refine(
    (value) => new Date(value.startAt).getTime() < new Date(value.endAt).getTime(),
    {
      message: "The end time must be after the start time.",
      path: ["endAt"],
    },
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
