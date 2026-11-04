import z from "zod";
import { newsletterSchema } from "../schema/schema";

export type NewsletterMessageKey = "emailRequired" | "emailInvalid";
export type Translate = (key: NewsletterMessageKey) => string;
export type INewsLetterFormValues = z.infer<
  ReturnType<typeof newsletterSchema>
>;
