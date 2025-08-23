import ClientLayout from './ClientLayout';

export const metadata = {
  title: "PKW Attendance",
  description: "System Service",
};

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      { children }
    </ClientLayout>
  );
}
