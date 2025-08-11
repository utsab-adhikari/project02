import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders"; // Wraps SessionProvider
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kalamkunja - Explore The Core",
  description: "Dive deep into insightful articles and share your knowledge.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <ClientProviders>
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col">
              <Navbar />
              <Toaster />
              <main className="flex-1 pb-8">{children}</main>
            </div>
          </div>
        </ClientProviders>
        <Footer />
      </body>
    </html>
  );
}
