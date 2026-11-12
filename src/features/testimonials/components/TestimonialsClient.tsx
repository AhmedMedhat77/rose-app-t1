"use client";

import Image from "next/image";
import { ITestimonials } from "../lib/types/testimonials";
import { Star } from "lucide-react";
import { useLocale } from "next-intl";

export default function TestimonialsClient({
  allTestimonials,
}: {
  allTestimonials: ITestimonials;
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div>
      <section className="bg-bg-primary-fade dark:bg-bg-plain mt-10 w-full overflow-hidden px-6 pt-20">
        <div>
          <div className="w-full overflow-hidden">
            <div
              className={`flex gap-12 p-10 hover:[animation-play-state:paused] ${
                isArabic ? "animate-marquee-rtl" : "animate-marquee-ltr"
              }`}
            >
              {[
                ...allTestimonials?.payload?.data,
                ...allTestimonials?.payload?.data,
              ].map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className="shadow-bg-primary-saturated/10 relative mt-10 flex h-62.5 w-[21.437rem] shrink-0 flex-col rounded-3xl bg-white px-6 pt-[4.75rem] pb-6 text-center shadow-[0_4px_50.5px]"
                >
                  {/* Customer Image */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative size-30 overflow-hidden rounded-full border-3 border-white bg-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-semibold text-gray-600">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Name */}
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-3 flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={13}
                        className={
                          index < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="mb-5 line-clamp-4 min-h-12 text-center text-xs leading-relaxed text-gray-700">
                    {item.content}
                  </p>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
