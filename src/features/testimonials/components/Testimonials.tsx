import React from "react";
import TestimonialsTitle from "./TestimonialsTitle";
import TestimonialsClient from "./TestimonialsClient";
import getAllTestimonials from "../lib/api";

export default async function Testimonials() {
  const allTestimonials = await getAllTestimonials();

  return (
    <>
      <TestimonialsTitle />
      <TestimonialsClient allTestimonials={allTestimonials} />
    </>
  );
}
