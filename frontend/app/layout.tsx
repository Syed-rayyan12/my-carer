import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const commissioner = localFont({
  src: "../public/fonts/commissioner.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-commissioner",
});

const nunito = localFont({
  src: "../public/fonts/nunito.woff2",
  weight: "200 1000",
  display: "swap",
  variable: "--font-nunito",
});

const bebasNeue = localFont({
  src: "../public/fonts/bebas-neue.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

const plusJakartaSans = localFont({
  src: "../public/fonts/plus-jakarta-sans.woff2",
  weight: "200 800",
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
