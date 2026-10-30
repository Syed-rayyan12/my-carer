import type { Metadata } from "next";
import { Bebas_Neue, Commissioner, Nunito, Plus_Jakarta_Sans } from "next/font/google";
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

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
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
    <html lang="en" className={`${commissioner.variable} ${nunito.variable} ${bebasNeue.variable} ${plusJakartaSans.variable} m-0 w-full scroll-smooth p-0`}>
      <body  className="font-nunito! m-0 w-full bg-white p-0 text-[#101929] text-[16px] leading-[1.6] antialiased">{children}</body>
    </html>
  );
}
