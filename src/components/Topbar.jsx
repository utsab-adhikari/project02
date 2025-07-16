"use client";

import GoogleLoginPage from "@/app/auth/login/page";
import { useEffect, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = () => {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState("");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setLoggedIn("authenticated");
    } else if (status === "unauthenticated") {
      setLoggedIn("unauthenticated");
    }
  }, [status]);

  return (
   <div className="fixed top-4 right-4 z-30 block md:hidden">
  {(loggedIn === "authenticated" && pathname !== "/dashboard") && (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 px-4 py-2 bg-gray-800 border border-indigo-600/50 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-indigo-500/30"
    >
      <img
        src={session.user.image || "https://placehold.co/120x120/222222/EEEEEE?text=P"}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400 shadow-md"
      />
      Dashboard
    </Link>
  )}
</div>
  );
};

export default Topbar;
