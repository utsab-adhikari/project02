'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GoogleLoginPage() {
  const [providers, setProviders] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-white">
      <div className="bg-[#1f2937]/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-12 text-center max-w-md w-full border border-indigo-500/20">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-300 drop-shadow-lg">
          Welcome Back!
        </h1>
        <p className="text-base sm:text-lg mb-8 text-slate-300">
          Sign in or create a free account to explore and write amazing content.
        </p>

        {providers?.google && (
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-200 ease-in-out"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48" fill="none">
              <path d="M44.5 20H24V28.5H35.8C34.7 31.5 32 35 24 35C16.8 35 11 29.2 11 22C11 14.8 16.8 9 24 9C27.9 9 31.1 10.7 33.6 13.1L39.8 6.9C36.3 3.4 30.7 1 24 1C11.6 1 1.5 11.1 1.5 23.5C1.5 35.9 11.6 46 24 46C36.4 46 46.5 35.9 46.5 23.5C46.5 21.9 46.3 20.3 46 18.7L44.5 20Z" fill="#EA4335" />
              <path d="M11 22C11 18.2 12.6 14.8 15.2 12.2L9 6C5.5 9.5 3.5 14.6 3.5 20C3.5 25.4 5.5 30.5 9 34L15.2 27.8C12.6 25.2 11 21.8 11 18Z" fill="#FBBC04" />
              <path d="M24 9C27.9 9 31.1 10.7 33.6 13.1L39.8 6.9C36.3 3.4 30.7 1 24 1C11.6 1 1.5 11.1 1.5 23.5C1.5 35.9 11.6 46 24 46C36.4 46 46.5 35.9 46.5 23.5C46.5 21.9 46.3 20.3 46 18.7L44.5 20H24V28.5H35.8C34.7 31.5 32 35 24 35C16.8 35 11 29.2 11 22C11 14.8 16.8 9 24 9Z" fill="#4285F4" />
              <path d="M24 46C30.7 46 36.3 43.6 39.8 40.1L33.6 34C31.1 36.4 27.9 38 24 38C18.4 38 13.8 35.3 11 31.3L17.2 25.1C18.8 28.5 21.2 30.8 24 30.8C25.6 30.8 27.1 30.4 28.4 29.7L24 22V11C18.4 11 13.8 13.7 11 17.7L17.2 23.9C18.8 20.5 21.2 18.2 24 18.2C25.6 18.2 27.1 18.6 28.4 19.3L24 26.5V36.5C18.4 36.5 13.8 33.8 11 29.8L17.2 23.6C18.8 27 21.2 29.3 24 29.3C25.6 29.3 27.1 28.9 28.4 28.2L24 21V10C18.4 10 13.8 12.7 11 16.7L17.2 22.9C18.8 26.3 21.2 28.6 24 28.6C25.6 28.6 27.1 28.2 28.4 27.5L24 20V9H24C11.6 9 1.5 19.1 1.5 31.5C1.5 31.5 1.5 31.5 1.5 31.5L24 46Z" fill="#34A853" />
            </svg>
            Continue with Google
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-slate-400 text-center max-w-xs">
        🔐 We respect your privacy. Your data is secure and used only for authentication.
      </p>
    </div>
  );
}
