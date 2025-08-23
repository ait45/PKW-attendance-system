"use client"


import { SessionProvider } from "next-auth/react";
import { Kanit } from "next/font/google";
import "./globals.css";
const kanitSans = Kanit({
  weight: '400',
  subsets: ['thai'],
});


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={kanitSans.className} >
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}