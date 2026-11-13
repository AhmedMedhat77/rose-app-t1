import { useTranslations } from "next-intl";

export default function CompaniesTitle() {
  const t = useTranslations();
  return (
    <div className="font-primary text-text-maroon-700 text-center align-middle text-[36px] leading-none font-bold tracking-[0%]">
      {t("TrustedCompanies.trustedOver")} 
      <span className="text-soft-pink-500">
        {t("TrustedCompanies.increasedAmount")}{" "}
      </span>
      {t("TrustedCompanies.Companies")}
    </div>
  );
}
