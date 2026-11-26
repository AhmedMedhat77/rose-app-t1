import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoItemsFound() {
  const t = useTranslations("NoItemsFound");

  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-bg-soft flex size-16 items-center justify-center rounded-full">
        <PackageSearch className="text-text-muted size-8" />
      </div>

      <h3 className="text-text-primary text-lg font-semibold">{t("title")}</h3>

      <p className="text-text-muted max-w-sm text-sm">{t("description")}</p>
    </div>
  );
}
