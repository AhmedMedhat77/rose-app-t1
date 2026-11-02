import { DropdownMenuDemo } from "@/components/DropdownMenuDemo/DropdownMenuDemo";
import { Combobox } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();
  const fruits = [
    { value: "apple", label: t("demo.fruits.apple") },
    { value: "banana", label: t("demo.fruits.banana"), disabled: true },
    { value: "cherry", label: t("demo.fruits.cherry") },
    { value: "orange", label: t("demo.fruits.orange") },
    { value: "mango", label: t("demo.fruits.mango") },
    { value: "strawberry", label: t("demo.fruits.strawberry") },
    { value: "grape", label: t("demo.fruits.grape") },
    { value: "watermelon", label: t("demo.fruits.watermelon") },
    { value: "pineapple", label: t("demo.fruits.pineapple") },
    { value: "peach", label: t("demo.fruits.peach") },
    { value: "kiwi", label: t("demo.fruits.kiwi") },
    { value: "pear", label: t("demo.fruits.pear") },
    { value: "blueberry", label: t("demo.fruits.blueberry") },
    { value: "lemon", label: t("demo.fruits.lemon") },
    { value: "coconut", label: t("demo.fruits.coconut") },
    { value: "avocado", label: t("demo.fruits.avocado") },
  ];

  const items = [
    { value: "option1", label: t("demo.options.first") },
    { value: "option2", label: t("demo.options.second") },
    { value: "option3", label: t("demo.options.third") },
    { value: "option4", label: t("demo.options.fourth") },
    { value: "option5", label: t("demo.options.fifth") },
    { value: "option6", label: t("demo.options.sixth") },
    { value: "option7", label: t("demo.options.seventh") },
    { value: "option8", label: t("demo.options.eighth") },
    { value: "option9", label: t("demo.options.ninth") },
    { value: "option10", label: t("demo.options.tenth") },
    { value: "option11", label: t("demo.options.eleventh") },
    { value: "option12", label: t("demo.options.twelfth") },
    { value: "option13", label: t("demo.options.thirteenth") },
    { value: "option14", label: t("demo.options.fourteenth") },
    { value: "option15", label: t("demo.options.fifteenth") },
    { value: "option16", label: t("demo.options.sixteenth") },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex w-50 flex-col justify-center space-y-1.5">
        <label className="text-sm font-normal"></label>

        <Select items={items}>
          <SelectGroup>
            <SelectLabel>{t("select.label")}</SelectLabel>
          </SelectGroup>

          <SelectTrigger>
            <SelectValue placeholder={t("select.placeholder")} />
          </SelectTrigger>

          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <DropdownMenuDemo
          labels={{
            logout: t("menu.logout"),
            profile: t("menu.profile"),
            settings: t("menu.settings"),
          }}
        />
      </div>
      <div className="w-50">
        <Combobox
          label={t("select.label")}
          options={fruits}
          placeholder={t("select.placeholder")}
          searchPlaceholder={t("select.search")}
          loadingMessage={t("select.loading")}
          emptyMessage={t("select.noOptions")}
          errorMessage={t("select.error")}
        />
      </div>
    </div>
  );
}
