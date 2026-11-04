import { X } from "lucide-react";
import Image from "next/image";

export default function CategoryFilter() {
  const categories = [
    { id: 1, name: "Cards", imge: "/images/cards.png" },
    { id: 2, name: "Chocolate", imge: "/images/chocolate.png" },
    { id: 3, name: "Flowers", imge: "/images/Flowers.png" },
    { id: 4, name: "Cards", imge: "/images/cards.png" },
    { id: 5, name: "Chocolate", imge: "/images/chocolate.png" },
    { id: 6, name: "Flowers", imge: "/images/Flowers.png" },
    { id: 7, name: "Cards", imge: "/images/cards.png" },
    { id: 8, name: "Chocolate", imge: "/images/chocolate.png" },
    { id: 9, name: "Flowers", imge: "/images/Flowers.png" },
    { id: 10, name: "Cards", imge: "/images/cards.png" },
    { id: 11, name: "Chocolate", imge: "/images/chocolate.png" },
    { id: 12, name: "Flowers", imge: "/images/Flowers.png" },
    { id: 13, name: "Cards", imge: "/images/cards.png" },
    { id: 14, name: "Chocolate", imge: "/images/chocolate.png" },
    { id: 15, name: "Flowers", imge: "/images/Flowers.png" },
  ];
  return (
    <div className="border-border-subtle h-64.25 border-b">
      {/*heading*/}
      <div className="flex justify-between py-2.5">
        <h3 className="text-text-plain text-lg leading-none font-semibold tracking-normal">
          Category
        </h3>
        <button
          type="button"
          className="text-text-danger flex items-center gap-1 text-sm"
        >
          <X className="h-3.75 w-3.75" />
          Reset
        </button>
      </div>
      {/*Category List*/}
      <div className="flex max-h-49.75 flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/*Category Item*/}
        {categories.map((el) => (
          <div
            key={el.id}
            className="bg-bg-soft flex h-7 shrink-0 items-center gap-2.5 rounded-sm"
          >
            <div className="bg-bg-default flex h-full w-9 items-center justify-center rounded-s-sm">
              <Image
                src={el.imge}
                color="black"
                alt={el.name}
                width={21}
                height={20}
              />
            </div>
            <span className="text-inverse text-sm font-medium">{el.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
