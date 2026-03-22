import { z } from "zod";

export const createAccountSchema = z.object({
  type: z.string().min(1, "Type is required"),
  currency: z
    .string()
    .min(3, "Currency code required")
    .max(8, "Invalid currency")
    .transform((s) => s.toUpperCase()),
});

export type CreateAccountFormValues = z.infer<typeof createAccountSchema>;
