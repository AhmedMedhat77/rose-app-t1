import { API_URL } from "@/app/shared/constants/config";
import { ITestimonials } from "./types/testimonials";

export default async function getAllTestimonials() {
  const response = await fetch(`${API_URL}/testimonials`, {
    method: "GET",
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }

  const data: ITestimonials = await response.json();
  console.log("testimonials===>", data);
  return data;
}
