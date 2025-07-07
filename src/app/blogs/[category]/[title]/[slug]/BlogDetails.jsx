"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster for notifications
import { FaSpinner, FaExclamationCircle, FaUserEdit, FaTag, FaCalendarAlt } from "react-icons/fa"; // Icons for loading, error, and meta info
import dayjs from "dayjs"; // For date formatting

const BlogDetails = ({ category, title, slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          setBlog(res.data.blog);
        } else {
          toast.error("Blog not found.");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [category, title, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-inter">
        <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-6" />
        <p className="text-xl text-gray-400 font-medium">Loading blog details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex flex-col items-center justify-center p-4 font-inter">
        <FaExclamationCircle className="text-red-500 text-6xl mb-6" />
        <p className="text-xl font-semibold mb-2">Blog not found.</p>
        <p className="text-gray-400 text-lg text-center">
          The blog you are looking for might have been moved or does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 font-inter">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-5xl mx-auto bg-[#1e1f21] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Featured Image */}
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-64 sm:h-80 object-cover rounded-t-xl border-b border-gray-700 shadow-md"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/333333/FFFFFF?text=Blog+Image+Unavailable"; }} // Fallback
          />
        ) : (
          <div className="w-full h-64 sm:h-80 bg-gray-800 flex items-center justify-center rounded-t-xl border-b border-gray-700 shadow-md">
            <span className="text-gray-500 text-lg">No Featured Image</span>
          </div>
        )}

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-indigo-400 leading-tight drop-shadow-md">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm mb-8 text-gray-400">
            <span className="flex items-center gap-2 bg-indigo-600/20 px-4 py-2 rounded-full text-indigo-200 font-medium shadow-sm">
              <FaTag className="text-base" /> Category: {blog.category}
            </span>
            <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-300 font-medium shadow-sm">
              <FaUserEdit className="text-base" /> By: {blog.author}
            </span>
            {blog.createdAt && (
              <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-300 font-medium shadow-sm">
                <FaCalendarAlt className="text-base" /> Published: {dayjs(blog.createdAt).format('MMM DD, YYYY')}
              </span>
            )}
            {/* Slug is typically for URL, not always displayed. Keeping it optional. */}
            {/* <span className="px-3 py-1 rounded-full text-gray-500">
              Slug: {blog.slug}
            </span> */}
          </div>

          {/* Blog Content */}
          <article
            className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />

          {/* Footer Note */}
          <div className="mt-16 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg shadow-xl text-center">
            <h3 className="text-indigo-300 text-2xl font-bold mb-3">
              Thank you for reading!
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              We hope you found this article insightful. Feel free to share it with your network and explore more engaging content on DevBlogs. Your feedback is always welcome!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
