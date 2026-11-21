import type { ReactNode } from "react";
import {
  ClipboardListIcon,
  GiftIcon,
  HeadsetIcon,
  HomeIcon,
  InfoIcon,
  PartyPopperIcon,
} from "lucide-react";

import { MAIN_LINKS } from "@/shared/lib/constants/navigation.constant";

export type MainLinkKey = (typeof MAIN_LINKS)[number]["key"];

export const NAV_ICONS: Record<MainLinkKey, ReactNode> = {
  home: <HomeIcon aria-hidden="true" width={20} height={20} />,
  products: <GiftIcon aria-hidden="true" width={20} height={20} />,
  categories: <ClipboardListIcon aria-hidden="true" width={20} height={20} />,
  occasions: <PartyPopperIcon aria-hidden="true" width={20} height={20} />,
  contact: <HeadsetIcon aria-hidden="true" width={20} height={20} />,
  about: <InfoIcon aria-hidden="true" width={20} height={20} />,
};

export function isActiveNavLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
