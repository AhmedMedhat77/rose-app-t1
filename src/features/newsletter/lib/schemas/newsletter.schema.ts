import z from "zod";
import { Translate } from "../types/newsletter";

export function newsletterSchema(t: Translate) {
  return z.object({
    email: z.email(t("emailInvalid")).trim().min(1, t("emailRequired")),
  });
}
