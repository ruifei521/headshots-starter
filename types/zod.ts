import { z } from "zod";

export const fileUploadFormSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9 _\-\.\,\!\@\#\$\%\^\&\*\(\)\+\=]+$/, "Only letters, numbers, spaces, and basic symbols are allowed"),
  type: z
    .union([z.enum(['man', 'woman']), z.literal('')])
    .refine((val) => val === 'man' || val === 'woman', {
      message: 'Please select Man or Woman to continue.',
    }),
  dataConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to the data processing terms to proceed.",
  }),
});