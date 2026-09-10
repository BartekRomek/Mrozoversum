import type { Metadata } from "next";
import { BugReportPage } from "@/components/BugReportPage";

export const metadata: Metadata = {
  title: "Zgłoś błąd",
  robots: {
    index: false,
    follow: false
  }
};

export default function ZglosBladPage() {
  return <BugReportPage />;
}