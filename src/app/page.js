"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/v2");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse"></div>
      <div className="absolute top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse"></div>

      {/* Main loader */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center justify-center mb-8"
      >
        {/* Animated rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-48 h-48 border-4 border-indigo-500/30 rounded-full"
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-64 h-64 border-4 border-purple-500/30 rounded-full"
        ></motion.div>

        {/* Central logo */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <span className="text-4xl font-bold text-white">V2</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Countdown text */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center"
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Elevating Your Experience
        </motion.h1>

        <motion.div
          className="text-gray-300 text-lg mb-6"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Loading our next-generation platform
        </motion.div>

        <motion.div
          className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        >
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        </motion.div>

        <motion.div
          className="mt-8 text-indigo-300 flex items-center justify-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <svg
            className="animate-pulse w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.6 12.8l1.4-1.4 1.4 1.4 3.2-3.2-1.4-1.4-1.8 1.8-1.4-1.4-1.8 1.8-1.4-1.4-3.2 3.2 1.4 1.4 1.8-1.8zm10.4-10c0-1.1-.9-2-2-2h-16c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-16z" />
          </svg>
          <span>Redirecting in 5 seconds...</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
