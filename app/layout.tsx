import type { Metadata } from "next";
import { Commissioner, Nunito } from "next/font/google";
import "./globals.css";

const commissioner = Commissioner({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-commissioner",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "My Carer | Trusted Caregivers Near You",
  description:
    "Find trusted and verified caregivers near you with My Carer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${commissioner.variable} ${nunito.variable} m-0 w-full scroll-smooth p-0`}>
      <body  className="font-nunito! m-0 w-full bg-white p-0 text-[#101929] text-[16px] leading-[1.6] antialiased">{children}</body>
    </html>
  );
}
