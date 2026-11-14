import { RatingStars } from "@/shared/components/rating-stars";

export default function ReviewsList() {
  // Translate
  return (
    <div className="flex">
      {/*Review Item*/}
      <div>
        {/* name && date */}
        <div className="flex gap-2.5">
          <div className="bg-bg-maroon-secondary flex h-11.25 w-11.25 items-center justify-center rounded-full text-xl font-semibold text-white">
            A
          </div>
          <div className="flex flex-col">
            <h4 className="text-text-plain text-base font-semibold">Adrian</h4>
            <span className="text-sm font-medium text-zinc-400">
              {new Date("2025-04-07").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        {/*Rating */}
        <div className="flex items-center py-2.5">
          <RatingStars rating={4.5} />
          <span className="text-text-plain ms-1 text-base font-semibold">
            (4.5)
          </span>
        </div>
        <div>
          <h4 className="align-middle text-base font-semibold">
            Awesome Bouquet!
          </h4>
          <p className="text-text-default align-middle text-base leading-[125%] tracking-normal">
            I ordered this bouquet for a special occasion, and it absolutely
            exceeded my expectations! The flowers were fresh, beautifully
            arranged, and exactly as pictured—if not better. The color
            combination was stunning and gave off such a luxurious vibe. Even
            the wrapping was elegant and thoughtful. Delivery was right on time,
            and the bouquet arrived in perfect condition. The recipient was
            genuinely touched and couldn&apos;t stop admiring it. Highly
            recommend for anyone looking to make a lasting impression. Will
            definitely order again!
          </p>
        </div>
      </div>
      <div className="border-muted mx-4 border" />
    </div>
  );
}
