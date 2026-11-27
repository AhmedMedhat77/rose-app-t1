import { apiFetch } from "@/shared/lib/apis/fetch.api";
import type { ITestimonials } from "./types/testimonials";

export default async function getAllTestimonials() {
  return apiFetch<ITestimonials["payload"]>("/testimonials", {
    next: { revalidate: 300 },
  });
}
