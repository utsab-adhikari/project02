"use client";

import GoogleLoginPage from "@/app/auth/login/page";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid"; // Make sure you have Heroicons installed
import React from "react";

const NotLoggedIn = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full">
      <div className="fixed bottom-2 right-2 z-30 p-4">
        <div className="relative flex items-center gap-4 border border-white/40 bg-slate-600/10 backdrop-blur-md rounded-lg shadow-lg p-4 text-white">
          <div className="">Authenticate for creating Blogs</div>
          <div>
            <GoogleLoginPage />
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;
