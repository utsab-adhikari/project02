'use client';

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import Footer from "@/components/Footer";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import NotLoggedIn from "@/components/NotLoggedIn";
import Topbar from "@/components/Topbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isIndex, setIsIndex] = useState(false);

  useEffect(() => {
    setIsIndex(pathname === "/" || pathname === "/slide");
  }, [pathname]);

  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1ZMEDGLMSL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1ZMEDGLMSL', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>

      <body className="flex min-h-screen flex-col bg-gray-950 text-white">
        <SessionProvider>
          <SidebarProvider>
            <div className="flex flex-1 w-full">
              {/* ✅ Now inside SidebarProvider */}
              <AppSidebar />
              <SidebarTrigger className="fixed z-30 block md:hidden  top-2 left-2" />


              {!isIndex && (
                <button
                  className="fixed top-12 z-30 md:top-3 left-2 md:left-64 cursor-pointer text-white hover:text-gray-400"
                  onClick={() => router.back()}
                >
                  <IoMdArrowRoundBack size={24} />
                </button>
              )}

              <div className="flex flex-1 flex-col">
                <main className="flex flex-1 w-full min-h-screen">
                  <Toaster
                    position="bottom-center"
                    toastOptions={{
                      style: {
                        background: "#1e293b",
                        color: "#e2e8f0",
                      },
                    }}
                  />
                  <Topbar/>
                  <div className="w-full">{children}</div>
                  <NotLoggedIn/>
                </main>

                {!isIndex && (
                  <Link
                    href="/"
                    className="block md:hidden mx-auto py-2 my-3 px-5 border border-indigo-600 rounded-full text-indigo-300 hover:bg-indigo-800 hover:text-white transition-all duration-200 flex items-center gap-2 w-fit"
                  >
                    <FaHome />
                    Home
                  </Link>
                )}

                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
