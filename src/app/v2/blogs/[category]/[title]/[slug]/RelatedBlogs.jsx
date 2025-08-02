"use client";

import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBookOpen, FaSpinner, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    visible: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  return (
    <div className="w-full bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/20 shadow-xl mt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          More from {category}
        </h2>
        <Link 
          href={`/v2/blogs/${category}`}
          className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm"
        >
          View all <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="text-indigo-500 text-4xl" />
          </motion.div>
          <p className="text-gray-400 mt-4">Discovering related content...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 bg-red-900/20 rounded-lg border border-red-800/50">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && blogs.length === 0 && (
        <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
          <FaBookOpen className="text-indigo-400 text-4xl mx-auto mb-3" />
          <p className="text-gray-400">No other related blogs found in this category</p>
        </div>
      )}

      {!loading && !error && blogs.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={fadeIn}
              whileHover={{ y: -10 }}
            >
              <Link
                href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                className="block h-full bg-gradient-to-b from-gray-900/50 to-gray-950 rounded-xl border border-gray-800 overflow-hidden hover:border-indigo-500 transition-all duration-300 hover:shadow-indigo-500/10"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-70"></div>
                </div>

                {/* Blog Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-indigo-900/30 text-indigo-200 font-semibold px-2 py-1 rounded">
                      {blog.category}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {dayjs(blog.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-indigo-400 mt-4">
                    <span>Read article</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RelatedBlog;