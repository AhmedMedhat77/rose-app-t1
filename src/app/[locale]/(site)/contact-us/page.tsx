import { getTranslations } from "next-intl/server";

export default async function ContactUsPage() {
  const t = await getTranslations("ContactUs");

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <h1 className="text-3xl font-semibold text-zinc-800 dark:text-zinc-50">
        {t("title")}
      </h1>
    </main>
  );
}
