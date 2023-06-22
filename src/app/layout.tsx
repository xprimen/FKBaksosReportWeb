import Navbar from "@/components/Navbar";
import "./globals.css";
import { AppProvider } from "@/context/context";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fatwa Kehidupan Baksos",
  description: "Convert Baksos Report App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-base-200">
        <AppProvider>
          <Navbar />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
