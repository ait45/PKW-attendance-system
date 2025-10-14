// ตรวจสอบ Provider
import { AuthProvider } from "./Provider";


// font system
import { Kanit } from "next/font/google";
import "./globals.css";
// Progress Action
import ProgressBar from "./ProgressBar";

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
          <ProgressBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
