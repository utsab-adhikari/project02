"use client";

import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBookOpen, FaSpinner } from "react-icons/fa";

const RelatedBlog = ({ category, blogid }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`/api/blog/${category}`, {
          withCredentials: true,
        });

        if (!res?.data?.blogs || res.data.blogs.length === 0) {
          toast.error("No related blogs found for this category.");
          setBlogs([]);
        } else {
          const filteredBlogs = res.data.blogs.filter(
            (blog) => blog._id !== blogid
          );
          setBlogs(filteredBlogs);

          if (filteredBlogs.length === 0) {
            toast.success("No other related blogs found.");
          }
        }
      } catch (err) {
        toast.error("Failed to load related blogs.");
        setError("Failed to load related blogs. Please try again later.");
        console.error("Error fetching related blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      getBlogs();
    }
  }, [category, blogid]);

  return (
    <div className="w-full bg-[#1e1f21] text-white p-6 rounded-lg shadow-lg mt-12 border border-gray-700">
      <h2 className="text-2xl font-bold text-indigo-300 mb-6 border-b-2 border-indigo-500 pb-2">
        More from {category}
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-indigo-500 text-3xl mr-3" />
          <p className="text-gray-300 text-lg">Loading related blogs...</p>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-center py-8">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="text-gray-400 text-center py-8">
          <p>No other related blogs found in this category.</p>
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700 hover:border-indigo-500"
            >
              {/* Blog Image */}
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x300/333333/FFFFFF?text=Image+Unavailable";
                  }}
                />
              ) : (
                <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}

              {/* Blog Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2 hover:underline">
                  <FaBookOpen className="inline-block mr-2 text-indigo-300" />
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400">
                  Category:{" "}
                  <span className="font-medium text-indigo-300">
                    {blog.category}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Published: {dayjs(blog.createdAt).format("MMMM D, YYYY")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedBlog;
