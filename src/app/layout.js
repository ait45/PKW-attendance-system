import { AuthProvider } from "./Provider";
import { Kanit } from "next/font/google";
import "./globals.css";
const kanitSans = Kanit({
  weight: '400',
  subsets: ['thai'],
});


export const metadata = {
  title: "PKW Attendance",
  description: "System Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={kanitSans.className} >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
