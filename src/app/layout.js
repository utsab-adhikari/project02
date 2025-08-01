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
import { motion, AnimatePresence } from "framer-motion";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isIndex, setIsIndex] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const indexPaths = ["/v2", "/", "/slide"];
    setIsIndex(indexPaths.includes(pathname));
    
    // Show back button on all pages except index and slide
    setShowBackButton(!indexPaths.includes(pathname));
  }, [pathname]);

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
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

      <body className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white overflow-x-hidden">
        <SessionProvider>
          <SidebarProvider>
            <div className="flex flex-1 w-full">
              {/* Sidebar */}
              <AppSidebar />
              
              {/* Main Content Area */}
              <div className="flex flex-1 flex-col w-full">
                {/* Floating particles */}
                <div className="fixed top-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse z-0"></div>
                <div className="fixed top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse z-0"></div>
                <div className="fixed bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse z-0"></div>

                  
             
                    {showBackButton && (
                      <motion.button
                        className="fixed top-2 right-2 z-50 flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
                        onClick={() => router.back()}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <IoMdArrowRoundBack />
                        <span className="hidden sm:inline">Back</span>
                      </motion.button>
                    )}

                {/* Main Content */}
                <main className="flex-1 w-full min-h-screen relative z-10">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        background: "#111827",
                        color: "#fff",
                        border: '1px solid #1f2937'
                      },
                    }}
                  />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={pathname}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {children}
                    </motion.div>
                  </AnimatePresence>
                </main>

                {/* Mobile Home Button */}
                {!isIndex && (
                  <motion.div 
                    className="fixed bottom-6 right-6 z-20 md:hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/"
                      className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaHome className="text-white text-xl" />
                    </Link>
                  </motion.div>
                )}

                {/* Footer */}
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}