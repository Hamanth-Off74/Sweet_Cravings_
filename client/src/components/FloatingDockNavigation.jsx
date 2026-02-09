import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconToolsKitchen2,
  IconShoppingCart,
  IconHeart,
  IconInfoCircle,
  IconPhone,
  IconUser
} from "@tabler/icons-react";

export function FloatingDockNavigation() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/",
    },
    {
      title: "Menu",
      icon: <IconToolsKitchen2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/menu",
    },
    {
      title: "Cart",
      icon: <IconShoppingCart className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/cart",
    },
    {
      title: "Wishlist",
      icon: <IconHeart className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/wishlist",
    },
    {
      title: "About",
      icon: <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/about",
    },
    {
      title: "Contact",
      icon: <IconPhone className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/contact",
    },
    {
      title: "Admin",
      icon: <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/admin",
    },
  ];

  return (
    <FloatingDock items={links} />
  );
}
