"use client";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBookOpen, FaSpinner } from "react-icons/fa";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog/getall`, {
          withCredentials: true,
        });

        if (!res?.data?.blogs || res.data.blogs.length === 0) {
          toast.error("No blogs found.");
        } else {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        toast.error("Failed to load blogs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 font-inter">

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-indigo-400 drop-shadow-lg">
          Explore Our Latest Insights
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#1e1f21] rounded-xl shadow-lg border border-gray-700">
            <FaSpinner className="animate-spin text-indigo-500 text-5xl mb-4" />
            <p className="text-gray-400 text-xl font-medium">Loading amazing blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center p-12 bg-[#1e1f21] rounded-xl shadow-lg border border-gray-700 flex flex-col items-center justify-center">
            <FaBookOpen className="text-indigo-400 text-6xl mb-6" />
            <p className="text-red-400 text-2xl font-semibold mb-2">
              No blogs available yet.
            </p>
            <p className="text-gray-400 text-lg">
              Check back soon for new content!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-[#1e1f21] border border-gray-700 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 ease-in-out flex flex-col overflow-hidden transform hover:-translate-y-1"
              >
                {/* Featured Image */}
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="h-48 w-full object-cover rounded-t-xl border-b border-gray-700"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x200/333333/FFFFFF?text=Image+Unavailable"; }} // Fallback
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-800 flex items-center justify-center rounded-t-xl border-b border-gray-700">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Blog Title */}
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>

                    {/* Blog Slug (optional, can be removed if not critical for display) */}
                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                      <span className="text-gray-300 font-medium">Slug:</span>{" "}
                      {blog.slug}
                    </p>

                    {/* Categories and Author */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs bg-indigo-600/30 text-indigo-200 font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {blog.category}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 font-medium px-3 py-1.5 rounded-full shadow-sm">
                        By {blog.author}
                      </span>
                      {/* Assuming createdAt might be useful here, if available and desired */}
                      {blog.createdAt && (
                         <span className="text-xs bg-gray-700 text-gray-300 font-medium px-3 py-1.5 rounded-full shadow-sm">
                           {dayjs(blog.createdAt).format('MMM DD, YYYY')}
                         </span>
                      )}
                    </div>
                  </div>

                  {/* Read More Link */}
                  <Link
                    href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                    className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Read More <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
