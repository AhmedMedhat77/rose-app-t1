import SectionsTitle from "@/shared/components/SectionsTitle";
import { useTranslations } from "next-intl";

export default function TestimonialsTitle() {
  const t = useTranslations();

  return (
    <>
      <SectionsTitle
        mainTitle={`${t("Testimonials.text")}`}
        sideTitle={`${t("Testimonials.label")}`}
        className="mx-auto w-fit text-center"
      />
    </>
  );
}
