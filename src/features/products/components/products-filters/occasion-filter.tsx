import { X } from "lucide-react";
import Image from "next/image";

export default function OccasionFilter() {
  const occasions = [
    { id: 1, name: "Father’s Day", image: "/images/Father’s Day.png" },
    { id: 2, name: "Apology", image: "/images/apology.png" },
    { id: 3, name: "Graduation", image: "/images/Graduation.jpg" },
    { id: 4, name: "Wedding", image: "/images/wedding.jpg" },
  ];

  return (
    <div className="h-75">
      {/*heading*/}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          Occasion
        </h3>
        <button
          type="button"
          className="text-text-danger flex items-center gap-1 text-sm"
        >
          <X className="h-3.75 w-3.75" />
          Reset
        </button>
      </div>
      {/*Occasion List*/}
      <div className="grid max-h-60.5 grid-cols-2 gap-2.5">
        {occasions.map((el) => (
          <div key={el.id} className="bg relative size-33.25 h-18.5 rounded-lg">
            <Image src={el.image} alt={el.name} fill className="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
