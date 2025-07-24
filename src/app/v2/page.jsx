"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function V2Launch() {
  return (
    <main className="bg-black text-white min-h-screen font-sans">
      {/* Fullscreen Animated Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold"
        >
          Welcome to <span className="text-purple-500">V2</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-lg md:text-xl text-gray-400"
        >
          A better, faster, smarter version of our platform 🚀
        </motion.p>

        {/* Cool animated background effect */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-gradient-radial from-purple-900 via-transparent to-black opacity-20"
        />
      </section>

      {/* Beta Test Route Buttons */}
      <section className="py-16 px-6 md:px-16 text-center">
        <h2 className="text-3xl font-semibold mb-8 text-white">
          🔧 Beta Testing Routes
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            { href: "/v2/dashboard", label: "Dashboard" },
            { href: "/v2/profile", label: "Profile" },
            { href: "/v2/settings", label: "Settings" },
            { href: "/", label: "Back to Home" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-6 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-medium transition"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
