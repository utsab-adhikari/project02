"use client";
import Link from "next/link";
import { FaGoogle, FaArrowLeft, FaSpinner, FaUserLock } from "react-icons/fa";
import GoogleLoginPage from "@/app/auth/login/page";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black text-indigo-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl" />
        </motion.div>
        <motion.p 
          className="mt-6 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Securing your session...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-indigo-900/20 px-4 py-10 text-white font-inter relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse"></div>
      <div className="absolute top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse"></div>
      
      {/* Back button */}
      <motion.div 
        className="absolute top-6 left-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
      </motion.div>

      {/* Login card */}
      <motion.div 
        className="bg-gray-900/80 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl w-full max-w-md text-center relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>
        
        {/* Icon */}
        <motion.div 
          className="mx-auto w-20 h-20 rounded-full bg-indigo-900/50 flex items-center justify-center mb-6 border border-indigo-500/30"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaUserLock className="text-indigo-400 text-3xl" />
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome Back!
        </motion.h1>

        <motion.p 
          className="text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sign in to access your blog dashboard and continue creating
        </motion.p>

        {/* Google login button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <GoogleLoginPage />
        </motion.div>

        <motion.div 
          className="relative my-8 flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-500 mb-4">
            Don't have an account? You'll be automatically registered
          </p>
          
          <p className="text-xs text-gray-600 mt-8">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors duration-200"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </motion.div>

      {/* Footer note */}
      <motion.div 
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Secured with NextAuth.js • All credentials encrypted</p>
      </motion.div>
    </div>
  );
}