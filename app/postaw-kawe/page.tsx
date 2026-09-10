import type { Metadata } from "next";
import { SupportPage } from "@/components/SupportPage";

export const metadata: Metadata = {
  title: "Postaw kawę",
  description:
    "Mrozoversum jest darmowym projektem tworzonym z pasji. Jeśli chcesz wesprzeć jego rozwój i utrzymanie, możesz postawić kawę twórcy projektu.",
  openGraph: {
    title: "Postaw kawę twórcy Mrozoversum",
    description:
      "Mrozoversum to niezależny, darmowy projekt tworzony z pasji. Każde wsparcie pomaga rozwijać projekt dalej.",
    url: "https://mrozoversum.pl/postaw-kawe"
  },
  alternates: {
    canonical: "https://mrozoversum.pl/postaw-kawe"
  }
};

export default function PostawKawePage() {
  return <SupportPage />;
}