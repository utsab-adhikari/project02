"use client";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBookOpen, FaSpinner, FaArrowRight, FaEye, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BlogByCategory = ({ category }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog/${category}`, {
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
  }, [category]);

  // Sort blogs based on selected option
  const sortedBlogs = [...blogs].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "popular":
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  // Filter blogs based on search query
  const filteredBlogs = sortedBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.description &&
        blog.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-4 sm:p-6 lg:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header with category name */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-4">
            Explore {category}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover thought-provoking articles, tutorials, and stories on{" "}
            {category}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-lg mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                ></path>
              </svg>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            {/* View All Link */}
            <div className="flex items-center justify-center">
              <Link
                href="/v2/blogs"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
              >
                View all categories <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-800">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="text-indigo-500 text-5xl" />
            </motion.div>
            <p className="text-gray-400 text-xl mt-4">
              Discovering amazing content...
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div
            className="text-center p-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-800 flex flex-col items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <FaBookOpen className="text-indigo-400 text-6xl mb-6" />
            <p className="text-red-400 text-2xl font-semibold mb-2">
              No blogs found
            </p>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              We couldn't find any blogs matching your criteria. Try adjusting
              your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSortOption("newest");
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-indigo-500/20"
                >
                  {/* Featured Image */}
                  <div className="relative h-56 overflow-hidden">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                    {/* Engagement metrics overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white text-xs">
                      <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                        <FaEye className="text-indigo-300" />
                        <span>{blog.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                        <FaHeart className="text-red-400" />
                        <span>{blog.likes} likes</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {dayjs(blog.createdAt).format("MMM DD, YYYY")}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-300 font-medium px-2.5 py-1 rounded-full">
                          By {blog.author}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                    </div>

                    <Link
                      href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                      className="mt-4 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Read More
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogByCategory;
