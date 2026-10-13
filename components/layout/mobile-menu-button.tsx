"use client";

import { LuMenu } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

/** Opens the sidebar drawer. Visibility (mobile only) is controlled by the className passed in. */
export function MobileMenuButton({ className }: { className?: string }) {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <Button
      variant="secondary"
      shape="rounded"
      iconOnly
      className={className}
      aria-label="Open menu"
      aria-expanded={mobileOpen}
      aria-controls="app-sidebar"
      onClick={() => setMobileOpen(true)}
    >
      <LuMenu />
    </Button>
  );
}
