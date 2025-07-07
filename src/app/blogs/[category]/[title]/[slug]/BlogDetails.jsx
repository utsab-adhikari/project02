"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const BlogDetails = ({ category, title, slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog?.length > 0) {
          setBlog(res.data.blog[0]); // assuming it's an array
        } else {
          toast.error("Blog not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [category, title, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">Loading blog details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-red-400 flex items-center justify-center">
        <p className="text-lg">Blog not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 text-indigo-300">{blog.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm mb-6 text-gray-400">
          <span className="bg-indigo-600/20 px-3 py-1 rounded-full text-indigo-200">
            Category: {blog.category}
          </span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-gray-300">
            By: {blog.author}
          </span>
          <span className="px-3 py-1 rounded-full text-gray-500">
            Slug: {blog.slug}
          </span>
        </div>

        {/* Image */}
        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-72 object-cover rounded-lg shadow mb-8 border border-white/10"
          />
        )}

        {/* Content */}
        <article
          className="prose prose-invert prose-lg max-w-none text-gray-200"
          dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
        />

        {/* Footer Note */}
        <div className="mt-16 bg-white/5 border border-white/10 p-6 rounded-lg shadow-inner">
          <h3 className="text-indigo-300 text-xl font-semibold mb-2">
            ✨ Thank you for reading!
          </h3>
          <p className="text-gray-300 text-sm">
            If you found this article helpful, feel free to share it and explore more on DevBlogs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
