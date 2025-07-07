"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const LandingPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(`/api/blog/getall`, {
          withCredentials: true,
        });
        setBlogs(res.data.blogs.slice(0, 3));
      } catch (err) {
        toast.error("Failed to load blogs.");
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
      }
    };

    getBlogs();
    getCategories();
  }, []);

  return (
    <div className="text-white min-h-screen">
      {/* Hero */}
      <section className="text-center py-16 px-4 bg-[#1e293b] shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to DevBlogs</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-300">
          A place to explore ideas, share insights, and stay updated with technology, education, and more.
        </p>
      </section>

      {/* Latest Blogs */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400">Latest Blogs</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-xl bg-white/5 backdrop-blur-md p-4 shadow hover:shadow-indigo-500/30 transition duration-300 flex flex-col"
            >
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="h-40 w-full object-cover rounded-md mb-4"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="font-medium text-gray-300">Slug:</span> {blog.slug}
                  </p>
                  <div className="mt-2 flex gap-2 flex-wrap text-xs">
                    <span className="bg-indigo-400/20 text-indigo-200 px-2 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <span className="bg-indigo-500 text-white px-2 py-1 rounded-full">
                      by {blog.author}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="mt-4 text-sm text-indigo-300 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#0f172a] px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          Explore Categories
        </h2>
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No categories available.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="px-4 py-2 bg-indigo-400/10 text-indigo-200 border border-indigo-600 rounded-full text-sm font-medium"
              >
                {cat.category}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section className="bg-[#1e293b] px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-indigo-400 mb-4">
          About DevBlogs
        </h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg">
          DevBlogs is a community-driven platform where developers, students,
          and enthusiasts share their ideas and projects. Whether you're into
          web development, AI, engineering, or storytelling, there's a place
          here for you to publish and grow.
        </p>
      </section>

      {/* Contact */}
      <section className="bg-[#0f172a] px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-4">
          Contact Us
        </h2>
        <form className="max-w-xl mx-auto grid gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded font-medium transition"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default LandingPage;
