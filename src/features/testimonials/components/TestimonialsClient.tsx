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
      <section className="bg-bg-primary-fade dark:bg-bg-plain w-full overflow-hidden px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="w-full overflow-hidden">
            <div
              className={`flex w-max gap-6 hover:[animation-play-state:paused] ${
                isArabic ? "animate-marquee-rtl" : "animate-marquee-ltr"
              }`}
            >
              {[
                ...allTestimonials?.payload?.data,
                ...allTestimonials?.payload?.data,
              ].map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className="relative mt-9 w-[21.4rem] shrink-0 rounded-xl bg-white px-6 pt-9 pb-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  {/* Customer Image */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative size-16 overflow-hidden rounded-full border-2 border-white bg-gray-200">
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
