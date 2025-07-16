"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster for notifications
import Link from "next/link"; // Assuming Next.js Link component
import {
  FaArrowRight,
  FaCode,
  FaGraduationCap,
  FaLightbulb,
  FaEnvelope,
  FaUser,
  FaCommentDots,
  FaSpinner,
} from "react-icons/fa"; // Icons for various sections
import Contact from "@/components/Contact";
import About from "@/components/About";
import NotLoggedIn from "@/components/NotLoggedIn";

const LandingPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { status } = useSession();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(`/api/blog/getall`, {
          withCredentials: true,
        });
        setBlogs(res.data.blogs.slice(0, 3)); // Still limiting to 3 for the landing page
      } catch (err) {
        toast.error("Failed to load latest blogs.");
      } finally {
        setLoadingBlogs(false);
      }
    };

    const getCategories = async () => {
      try {
        const res = await axios.get(`/api/blog/category`, {
          withCredentials: true,
        });
        setCategories(res.data.category);
      } catch (err) {
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    getBlogs();
    getCategories();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setLoggedIn(true);
    } else if (status === "unauthenticated") {
      setLoggedIn(false);
    }
  }, [status]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-inter">
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-indigo-950 shadow-2xl">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://www.transparenttextures.com/patterns/cubes.png")',
          }}
        ></div>{" "}
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-lg animate-fade-in-down">
            Welcome to DevBlogs
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-gray-300 mb-8 animate-fade-in-up">
            Your hub for cutting-edge insights, shared knowledge, and vibrant
            discussions across technology, education, and beyond.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href="/blogs"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Explore Blogs <FaArrowRight className="ml-2" />
            </Link>
            {loggedIn && (
              <Link
                href="/blogs/create"
                className="inline-flex items-center px-8 py-3 border border-indigo-500 text-indigo-300 font-semibold rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Write a Blog <FaCode className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-400 drop-shadow-lg">
          Our Latest Insights
        </h2>
        {loadingBlogs ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#1e1f21] rounded-xl shadow-lg border border-gray-700">
            <FaSpinner className="animate-spin text-indigo-500 text-5xl mb-4" />
            <p className="text-gray-400 text-xl font-medium">
              Fetching the freshest blogs...
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center p-12 bg-[#1e1f21] rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center">
            <FaLightbulb className="text-indigo-400 text-6xl mb-6" />
            <p className="text-red-400 text-2xl font-semibold mb-2">
              No recent blogs to display.
            </p>
            <p className="text-gray-400 text-lg">
              Be the first to publish an amazing article!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-[#1e1f21] border border-gray-700 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 ease-in-out flex flex-col overflow-hidden transform hover:-translate-y-1"
              >
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded-t-xl border-b border-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x200/333333/FFFFFF?text=Image+Unavailable";
                    }} // Fallback
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-800 flex items-center justify-center rounded-t-xl border-b border-gray-700">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                      <span className="text-gray-300 font-medium">Slug:</span>{" "}
                      {blog.slug}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-indigo-600/30 text-indigo-200 font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {blog.category}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 font-medium px-3 py-1.5 rounded-full shadow-sm">
                        By {blog.author}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                    className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Read More <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            href="/blogs"
            className="inline-flex items-center px-8 py-3 bg-transparent border border-indigo-500 text-indigo-300 font-semibold rounded-full shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            View All Blogs <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-800 px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-400 drop-shadow-lg">
          Explore Diverse Categories
        </h2>
        {loadingCategories ? (
          <div className="flex flex-col items-center justify-center h-40">
            <FaSpinner className="animate-spin text-indigo-500 text-4xl mb-4" />
            <p className="text-gray-400 text-lg">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8 bg-[#1e1f21] rounded-xl shadow-lg border border-gray-700">
            <p className="text-gray-500 text-lg">
              No categories available yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blogs/${cat.category}`}
                className="px-6 py-3 bg-indigo-600/20 text-indigo-200 border border-indigo-600 rounded-full text-lg font-medium hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {cat.category}
              </Link>
            ))}
          </div>
        )}
      </section>

      <About />

      <Contact />
    </div>
  );
};

export default LandingPage;
