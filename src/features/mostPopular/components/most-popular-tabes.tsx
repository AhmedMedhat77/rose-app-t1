"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { cn } from "cn";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

import type { MostPopularClientProps } from "../lib/types/mostPopular";

type Props = Pick<MostPopularClientProps, "occasions" | "sectionTitle"> & {
  selectedOccasionId: string;
};

export default function MostPopularTabs({
  occasions,
  selectedOccasionId,
  sectionTitle,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleOccasionChange(occasionId: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("occasionId", occasionId);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <div className="flex flex-col">
      <div className="my-6 flex justify-between">
        {sectionTitle}

        <Tabs
          value={selectedOccasionId}
          onValueChange={handleOccasionChange}
          className="w-fit"
        >
          <TabsList>
            {occasions.map((occasion) => (
              <TabsTrigger
                key={occasion.id}
                value={occasion.id}
                className={cn(
                  "hover:bg-bg-muted dark:text-text-muted bg-bg-plain dark:bg-bg-subtle border-0",
                  "data-active:bg-bg-plain data-active:text-text-maroon",
                  "data-active:dark:bg-bg-subtle",
                  "data-active:hover:bg-bg-muted",
                  "data-disabled:bg-bg-muted data-disabled:text-text-muted",
                )}
              >
                {occasion.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
