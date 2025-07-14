"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster for notifications
import {
  FaSpinner,
  FaExclamationCircle,
  FaUserEdit,
  FaTag,
  FaCalendarAlt,
} from "react-icons/fa"; // Icons for loading, error, and meta info
import dayjs from "dayjs"; // For date formatting
import RelatedBlog from "./RelatedBlogs";

const BlogDetails = ({ category, title, slug }) => {
  const [blog, setBlog] = useState("");
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          setBlog(res.data.blog);
          setAuthor(res.data.author);
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
        <p className="text-xl text-gray-400 font-medium">
          Loading blog details...
        </p>
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
      <div className="max-w-5xl mx-auto bg-[#1e1f21] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-64 sm:h-80 object-cover rounded-t-xl border-b border-gray-700 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/1200x400/333333/FFFFFF?text=Blog+Image+Unavailable";
            }} // Fallback
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
           <a
  href={`/profile/${author.email}`}
  className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-300 font-medium shadow-sm hover:bg-gray-600 hover:text-white transition duration-200"
>
  <img
    src={author?.image}
    alt={author?.name || "Author"}
    className="w-6 h-6 rounded-full object-cover border border-gray-600"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = "https://placehold.co/32x32/2D3748/FFFFFF?text=U";
    }}
  />
  <span className="text-sm font-medium">
    {author?.name || blog.author}
  </span>
</a>

            {blog.createdAt && (
              <span className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full text-gray-300 font-medium shadow-sm">
                <FaCalendarAlt className="text-base" /> Published:{" "}
                {dayjs(blog.createdAt).format("MMM DD, YYYY")}
              </span>
            )}
          </div>
          <article
            className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />
          <div className="mt-16 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg shadow-xl text-center">
            <h3 className="text-indigo-300 text-2xl font-bold mb-3">
              Thank you for reading!
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              We hope you found this article insightful. Feel free to share it
              with your network and explore more engaging content on DevBlogs.
              Your feedback is always welcome!
            </p>
          </div>
        </div>
      </div>

        <RelatedBlog category={blog.category} blogid={blog._id} />
    </div>
  );
};

export default BlogDetails;
