import { Button } from "@/components/ui/button";
import { Input, PhoneNumberInput } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();
  return (
    <div>
      {t("welcome")}
      <Button>Primary</Button>

      <Input label="default" variant="default" />
      <Input label="password" variant="password" />
      <Input label="Search" variant="search" inputSize="lg" />
      <Input label="error" isError={true} inputSize="sm" />
      <Input label="number" variant="number" inputSize="lg" />
      <Input label="upload" variant="upload" />
      <Input label="disabled" isDisabled={true} />

      <PhoneNumberInput />

      <div>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot isDisabled={true} index={0} />
            <InputOTPSlot isError={true} index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>

          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </div>
  );
}
