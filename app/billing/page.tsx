import type { Metadata } from "next";
import { AppHeader } from "@/components/dashboard/app-header";
import { AppShell } from "@/components/layout/app-shell";
import { PageContent } from "@/components/layout/page-content";
import { BillingView } from "@/components/billing/billing-view";

export const metadata: Metadata = { title: "Billing", description: "Manage patient invoices and keep track of clinic billing." };

export default function BillingPage() {
  return <AppShell><AppHeader /><PageContent><BillingView /></PageContent></AppShell>;
}
