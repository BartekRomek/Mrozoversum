import type { Metadata } from "next";
import { SettingsPage } from "@/components/SettingsPage";

export const metadata: Metadata = {
  title: "Ustawienia",
  robots: {
    index: false,
    follow: false
  }
};

export default function UstawieniaPage() {
  return <SettingsPage />;
}