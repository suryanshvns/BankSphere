import { z } from "zod";

export const loanApplySchema = z.object({
  purpose: z.string().min(1, "Purpose is required").max(200),
  principal: z
    .string()
    .min(1, "Principal is required")
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) > 0, {
      message: "Enter a valid principal",
    }),
  annualRatePct: z
    .string()
    .min(1, "Rate is required")
    .refine((v) => !Number.isNaN(parseFloat(v)) && parseFloat(v) >= 0, {
      message: "Enter a valid rate",
    }),
  tenureMonths: z
    .string()
    .min(1, "Tenure is required")
    .refine((v) => {
      const n = parseInt(v, 10);
      return !Number.isNaN(n) && n >= 1 && n <= 600;
    }, "Tenure must be between 1 and 600 months"),
});

export type LoanApplyFormValues = z.infer<typeof loanApplySchema>;
