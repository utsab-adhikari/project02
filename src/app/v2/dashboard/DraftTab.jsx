"use client";
import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { FaPlus, FaBookOpen, FaArrowRight, FaRegClock, FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

// Simplified ContextMenu
const ContextMenu = ({ blogId }) => (
  <div className="relative">
    <button className="text-gray-400 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    </button>
  </div>
);

const DraftTab = ({ drafts }) => {
  const handlePublish = async (blogId) => {
    try {
      toast.loading("Publishing...", { id: blogId });
      const res = await axios.put(`/api/v2/blog/publish`, { blogId });
      toast.success("Blog published!", { id: blogId });
    } catch (err) {
      toast.error("Failed to publish blog.", { id: blogId });
      console.error(err);
    }
  };

  return (
    <div>
      {drafts.length === 0 ? (
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaBookOpen className="text-indigo-400 text-5xl mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-300 mb-3">
            No drafts created yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Start crafting your ideas. Drafts are perfect for works in progress!
          </p>
          <Link
            href="/v2/blogs/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
          >
            <FaPlus /> Create New Draft
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((blog) => (
            <motion.div
              key={blog._id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >

              {/* Image section */}
              <div className="relative">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500">No featured image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 h-14">
                    {blog.title || "Untitled Draft"}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-indigo-600/30 text-indigo-200 font-semibold px-2 py-1 rounded">
                      {blog.category || "Uncategorized"}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {dayjs(blog.updatedAt || blog.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 h-16">
                    {blog.blogcontent?.replace(/<[^>]*>/g, "").substring(0, 100) || "No content yet..."}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-800">
                  <Link
                    href={`/v2/blogs/edit/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    <FaRegEdit /> Edit
                  </Link>
                  
                  <div className="flex gap-3">
                    <Link
                      href={`/v2/preview/${blog.category}/${blog.title}/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      Preview <FaArrowRight className="text-xs" />
                    </Link>
                    
                    <button
                      onClick={() => handlePublish(blog._id)}
                      className="text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftTab;