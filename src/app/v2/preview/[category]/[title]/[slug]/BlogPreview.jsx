"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaSpinner,
  FaExclamationCircle,
  FaTag,
  FaCalendarAlt,
  FaEye,
  FaHeart,
  FaShareAlt,
  FaCommentDots,
  FaPaperPlane,
  FaEdit,
  FaRocket
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

const BlogHeader = ({ blog, author, isDraft, handlePublish }) => {
  // Dummy stats for preview
  const previewLikes = Math.floor(Math.random() * 50) + 10;
  const previewViews = Math.floor(Math.random() * 300) + 100;
  const previewComments = Math.floor(Math.random() * 15) + 3;

  return (
    <header className="space-y-6 relative">
      {isDraft && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-amber-500 text-amber-900 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1">
            DRAFT PREVIEW
          </span>
        </div>
      )}
      
      {blog.featuredImage ? (
        <img
          src={blog.featuredImage}
          alt={`Featured image for ${blog.title}`}
          className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-[1.01]"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-xl border border-gray-700">
          <span className="text-gray-500 font-medium">No Featured Image</span>
        </div>
      )}
      
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm mt-4">
            <span className="flex items-center gap-1.5">
              <FaTag className="text-indigo-400" /> {blog.category}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-indigo-400" />{" "}
              {dayjs(blog.createdAt).format("MMM DD, YYYY")}
            </span>
            <span className="flex items-center gap-1.5">
              <FaEye className="text-indigo-400" /> {previewViews}
            </span>
            <span className="flex items-center gap-1.5">
              <FaHeart className="text-indigo-400" /> {previewLikes}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCommentDots className="text-indigo-400" /> {previewComments}
            </span>
          </div>
        </div>
      </div>
      
      {author && (
        <Link
          href={`/v2/profile/${author.email}`}
          className="flex items-center gap-3 transition-colors duration-200 hover:text-indigo-400 mt-4"
        >
          <img
            src={author.image}
            alt={`${author.name}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
          />
          <div>
            <span className="block text-gray-300 font-semibold">
              {author.name}
            </span>
            <span className="block text-gray-500 text-xs">Author</span>
          </div>
        </Link>
      )}
    </header>
  );
};

const BlogContent = ({ blog }) => (
  <article
    className="prose prose-xl dark:prose-invert text-gray-200 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
  />
);

const BlogActions = () => (
  <div className="flex flex-wrap items-center gap-4 mt-8 border-t border-gray-700 pt-6">
    <button className="flex items-center gap-2 text-white px-4 py-2 rounded-full transition-all duration-300 transform bg-indigo-600 hover:bg-indigo-700">
      <FaHeart />
      <span>Like this preview</span>
    </button>
    <button
      onClick={() => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => toast.success("Link copied to clipboard!"));
      }}
      className="flex items-center gap-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-colors"
      aria-label="Share link"
    >
      <FaShareAlt /> Share Preview
    </button>
  </div>
);

const CommentsPreview = () => {
  // Generate dummy comments
  const dummyComments = [
    {
      id: 1,
      author: "Jane Cooper",
      text: "This looks promising! Can't wait to read the full version when it's published.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
      id: 2,
      author: "Robert Fox",
      text: "Interesting perspective. I'd love to see more data on this topic.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    },
    {
      id: 3,
      author: "Wade Warren",
      text: "Well written draft. Looking forward to the final version!",
      createdAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    },
  ];

  return (
    <div id="comments-section" className="mt-8 pt-4 border-t border-gray-800">
      <h3 className="text-2xl font-bold text-white mb-6">Preview Comments</h3>
      
      <div className="space-y-4">
        {dummyComments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-800 p-4 rounded-xl text-sm shadow-sm opacity-70"
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600" />
                <span className="text-gray-300 font-medium">
                  {comment.author}
                </span>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {dayjs(comment.createdAt).fromNow()}
              </div>
            </div>
            <p className="text-gray-200 leading-snug">{comment.text}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm italic">
          These are simulated comments. Real comments will appear after publishing.
        </p>
      </div>
    </div>
  );
};

const BlogPreview = ({ category, title, slug }) => {
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const { data: session } = useSession();

  // Fetch blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          const fetchedBlog = res.data.blog;
          setBlog(fetchedBlog);
          setAuthor(res.data.author);
          setIsDraft(fetchedBlog.publishType === "draft");
        } else {
          toast.error("Blog not found.");
        }
      } catch (err) {
        console.error("Error fetching blog details:", err);
        toast.error("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [category, title, slug]);

  const handlePublish = async () => {
    if (!blog?._id) return;
    
    setPublishing(true);
    try {
      const res = await axios.put(`/api/v2/blog/publish`, { blogId: blog._id });
      toast.success(res.data.message || "Blog published successfully!");
      setIsDraft(false);
      
      // Redirect to published version after 2 seconds
      setTimeout(() => {
        window.location.href = `/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`;
      }, 2000);
    } catch (err) {
      console.error("Publish error:", err);
      toast.error(err.response?.data?.message || "Failed to publish blog");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center bg-gray-950">
        <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-4" />
        <p className="text-xl text-gray-400">Loading preview...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen text-red-400 flex flex-col items-center justify-center bg-gray-950">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <p className="text-xl font-semibold">Blog not found.</p>
        <p className="text-gray-400 text-center">
          This article might have been removed or not created yet.
        </p>
        <Link 
          href="/v2/blogs" 
          className="mt-6 text-indigo-400 hover:text-indigo-300"
        >
          Browse all blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white py-12 bg-gray-950">
      <div className="px-6 space-y-12">
        <BlogHeader 
          blog={blog} 
          author={author} 
          isDraft={isDraft}
          handlePublish={handlePublish}
        />
        
        <div className="space-y-10">
          <BlogContent blog={blog} />
          
          {isDraft && (
            <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-300 mb-2">
                Draft Mode Preview
              </h3>
              <p className="text-amber-100">
                You're previewing an unpublished draft. This content is only visible to you. 
                Stats and comments are simulated for preview purposes.
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    publishing 
                      ? "bg-gray-600 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {publishing ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaRocket />
                  )}
                  {publishing ? "Publishing..." : "Publish Now"}
                </button>
                <Link
                  href={`/v2/blogs/edit/${blog.slug}`}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                >
                  <FaEdit /> Edit Draft
                </Link>
              </div>
            </div>
          )}
          
          <BlogActions />
          <CommentsPreview />
        </div>
        
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <h3 className="text-2xl font-bold text-indigo-300 mb-2">
            {isDraft ? "Ready to share your knowledge?" : "Thanks for previewing!"}
          </h3>
          <p className="text-gray-400">
            {isDraft
              ? "Publish this draft to make it visible to everyone and start getting real feedback."
              : "This is a preview of how your blog will appear to readers after publishing."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;