import Layout from "@/components/Layout";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-screen w-screen overflow-hidden">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
