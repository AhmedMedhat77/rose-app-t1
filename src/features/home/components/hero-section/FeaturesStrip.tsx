import { useTranslations } from "next-intl";
import { FEATURES } from "../../constants/hero";

export function FeaturesStrip() {
  const t = useTranslations("Hero.features");

  return (
    <div className="bg-bg-primary-fade dark:bg-bg-plain mx-6 mt-2.5 grid gap-6 rounded-xl p-6 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ id, icon: Icon }) => (
        <div key={id} className="flex items-center gap-4">
          <span className="bg-maroon-600 text-text-inverse dark:bg-bg-primary-saturated flex size-16 items-center justify-center rounded-full dark:text-zinc-700">
            <Icon className="size-8" />
          </span>
          <div>
            <p className="dark:text-soft-pink-200 text-maroon-600 text-[20px] font-semibold">
              {t(`${id}.title`)}
            </p>
            <p className="text-text-soft dark:text-text-soft text-xs">
              {t(`${id}.text`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
