import SectionsTitle from "@/shared/components/SectionsTitle";
import { useTranslations } from "next-intl";

export default function TitleGallery() {
  const t = useTranslations();

  return (
    <>
      <SectionsTitle
        mainTitle={`${t("Gallery.text")}`}
        sideTitle={`${t("Gallery.label")}`}
        className="mx-auto w-fit text-center"
      />
    </>
  );
}
