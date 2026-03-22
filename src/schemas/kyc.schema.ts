import { z } from "zod";

export const kycSchema = z.object({
  referenceId: z
    .string()
    .min(1, "Reference ID is required")
    .max(128, "Reference ID is too long"),
});

export type KycFormValues = z.infer<typeof kycSchema>;
