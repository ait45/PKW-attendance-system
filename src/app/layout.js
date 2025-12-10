// ตรวจสอบ Provider
import { AuthProvider } from "./Provider";

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

export const metadata = {
  title: "PKW Service TH",
  description: "System Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={MyFontWeb.className}>
        <AuthProvider>
          <ProgressBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
