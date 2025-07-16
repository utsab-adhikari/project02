"use client";

import GoogleLoginPage from "@/app/auth/login/page";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useSession } from "next-auth/react";

const NotLoggedIn = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loggedIn, setLoggedIn] = useState("");

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setLoggedIn("authenticated");
    } else if (status === "unauthenticated") {
      setLoggedIn("unauthenticated");
    }
  }, [status]);

  if (!isVisible) return null;

  return (
    <>
      {loggedIn === "unauthenticated" && (
          <div className="fixed bottom-2 right-2 z-30 p-2 sm:p-4 max-w-[90vw] sm:max-w-md md:max-w-lg">
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border border-white/40 bg-slate-600/10 backdrop-blur-md rounded-lg shadow-lg p-3 sm:p-4 text-white text-sm sm:text-base">
              <div className="flex-1">Authenticate for creating Blogs</div>
              <div className="w-full sm:w-auto">
                <GoogleLoginPage />
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 sm:-top-2 sm:-right-2 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
      )}
    </>
  );
};

export default NotLoggedIn;
