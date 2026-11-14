import type { Metadata } from "next";
import { AccountPage } from "@/components/AccountPage";

export const metadata: Metadata = {
  title: "Konto użytkownika",
  description: "Twoje ulubione książki i postępy w Mrozoversum.",
  alternates: { canonical: "https://mrozoversum.pl/konto/" }
};

export default function AccountRoute() {
  return <AccountPage />;
}
