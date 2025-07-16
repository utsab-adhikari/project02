"use client";
import Link from "next/link";
import { FaGoogle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import GoogleLoginPage from "../auth/login/page";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen flex justify-center items-center text-indigo-400">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="ml-4 text-xl">Loading session...</span>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-white font-inter">
      <div className="bg-gray-800 border border-indigo-600/30 rounded-3xl p-8 sm:p-12 shadow-2xl w-full max-w-md text-center mx-auto relative overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-300 mb-6 mt-8">
          Welcome Back!
        </h1>

        <p className="text-md text-gray-400 mb-8">
          Sign in to access your blog dashboard.
        </p>

        <GoogleLoginPage />

        <p className="text-sm text-gray-500 mt-8">
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
      </div>
    </div>
  );
}
