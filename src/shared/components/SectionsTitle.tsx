import PopularLabel from "./popularLabel";
import { cn } from "cn";
interface PropsTitles {
  mainTitle: string;
  sideTitle?: string;
  className?: string;
}

export default function SectionsTitle({
  mainTitle,
  sideTitle,
  className,
}: PropsTitles) {
  return (
    <div>
      <div
        className={cn(
          "text-text-maron flex flex-col items-center justify-center gap-4",
          { className },
        )}
      >
        {sideTitle && (
          <p className="text-text-soft-pink-500 text-center align-middle font-[Sarabun] leading-none font-bold tracking-[0.25em] uppercase">
            {sideTitle}
          </p>
        )}
        <PopularLabel className="font-primary align-middle text-[36px] leading-none font-bold tracking-normal">
          {mainTitle}
        </PopularLabel>
      </div>
    </div>
  );
}
