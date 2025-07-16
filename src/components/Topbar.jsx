"use client";

import GoogleLoginPage from "@/app/auth/login/page";
import { useEffect, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Topbar = () => {
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
    <div className="fixed top-2 right-2 z-30 block md:hidden">
      {loggedIn === "authenticated" && (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 border border-white/40 bg-indigo-900 backdrop-blur-md px-2 py-1 rounded"
        >
          <img
            src={session.user.image}
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover border border-white"
          />
          Dashboard
        </Link>
      )}
    </div>
  );
};

export default Topbar;
