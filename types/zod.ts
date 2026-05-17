import { z } from "zod";

export const fileUploadFormSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),
  type: z.string().min(1).max(50),
  dataConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to the data processing terms to proceed.",
  }),
});