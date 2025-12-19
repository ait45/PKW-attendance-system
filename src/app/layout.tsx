// ตรวจสอบ Provider
import { AuthProvider } from "./AuthProvider";
import type { ReactNode } from "react";

// font system
import "./globals.css";
import localFont from "next/font/local";

const MyFontWeb = localFont({
  src: [
    {
      path: "./assets/fonts/Kanit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

// Progress Action
import ProgressBar from "./ProgressBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PKW Service TH",
  description: "System Service",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${MyFontWeb.className} antialiased`}>
        <AuthProvider>
          <ProgressBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
