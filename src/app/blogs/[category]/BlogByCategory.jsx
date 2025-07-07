"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BlogByCategory = ({category}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-indigo-300 mb-8 text-center">
      Blogs on {category}
    </h2>

    {loading ? (
      <p className="text-center text-gray-400">Loading blogs...</p>
    ) : blogs.length === 0 ? (
      <p className="text-center text-red-400">No blogs available.</p>
    ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white/5 backdrop-blur-md rounded-xl shadow-md hover:shadow-indigo-500/30 border border-white/10 transition duration-300 flex flex-col overflow-hidden"
          >
            {blog.featuredImage && (
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="h-44 w-full object-cover"
              />
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-400 mb-1 line-clamp-1">
                  <span className="text-gray-300 font-medium">Slug:</span> {blog.slug}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2 py-1 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-xs bg-white/10 text-gray-300 font-medium px-2 py-1 rounded-full">
                    by {blog.author}
                  </span>
                </div>
              </div>

              <button className="mt-4 text-sm text-indigo-400 font-semibold hover:underline hover:text-indigo-200 transition">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default BlogByCategory;
