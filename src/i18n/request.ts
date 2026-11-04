import { locale as getRootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  const paramValue = await getRootLocale();

  let locale: string;
  if (paramValue && hasLocale(routing.locales, paramValue)) {
    locale = paramValue;
  } else {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
