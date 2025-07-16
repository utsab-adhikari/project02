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
} from "react-icons/fa";
import dayjs from "dayjs";
import RelatedBlog from "./RelatedBlogs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const BlogDetails = ({ category, title, slug }) => {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState();
  const [isLikeLoading, setLikeLoading] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          setBlog(res.data.blog);
          setAuthor(res.data.author);
          setLikes(res.data.blog.likes || 0);
          setViews(res.data.blog.views || 0);
        } else {
          toast.error("Blog not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [category, title, slug]);

  const handleLike = async () => {
    setLikeLoading("Loading");

    if (status === "unauthenticated") {
      toast.error("Please login first");
    } else if (status === "authenticated") {
      try {
        const res = await axios.post(`/api/blog/${category}/${title}/${slug}`);
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      } catch (err) {
        toast.error("Failed to like the post.", err);
      } finally {
        setLikeLoading("");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-4" />
        <p className="text-xl text-gray-400">Loading blog details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex flex-col items-center justify-center">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <p className="text-xl font-semibold">Blog not found.</p>
        <p className="text-gray-400 text-center">
          This article might have been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Featured Image */}
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-700"
          />
        ) : (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center rounded-lg border border-gray-700">
            <span className="text-gray-500">No Featured Image</span>
          </div>
        )}

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-indigo-400 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
            <span className="flex items-center gap-1">
              <FaTag /> {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt /> {dayjs(blog.createdAt).format("MMM DD, YYYY")}
            </span>
            <span className="flex items-center gap-1">
              <FaEye /> {views}
            </span>
            <span className="flex items-center gap-1">
              <FaHeart /> {likes}
            </span>
          </div>
        </div>

        {/* Author Info */}
        {author && (
          <a
            href={`/profile/${author.email}`}
            className="flex items-center gap-3"
          >
            <img
              src={author.image}
              alt={author.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
            <span className="text-gray-300 font-medium">{author.name}</span>
          </a>
        )}

        {/* Blog Content */}
        <article className="prose prose-lg prose-invert text-gray-200">
          <div dangerouslySetInnerHTML={{ __html: blog.blogcontent }} />
        </article>

        {/* Actions: Like, Share, Comment */}
        <div className="flex flex-wrap items-center gap-4 mt-8 border-t border-gray-700 pt-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition"
          >
            {isLikeLoading === "Loading" ? (
              <FaSpinner className="animate-spin"/>
            ) : (
              <FaHeart className={`${liked ? "text-red-600" : "text-white"}`} />
            )}
            {liked ? <>Liked</> : <>Like</>}
          </button>
          <button
            onClick={() =>
              navigator.clipboard.writeText(window.location.href) &&
              toast.success("Link copied!")
            }
            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
          >
            <FaShareAlt /> Share
          </button>
          <a
            href="#comments"
            className="flex items-center gap-2 text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition"
          >
            <FaCommentDots /> Comment
          </a>
        </div>

        {/* Thank You / CTA */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
          <h3 className="text-2xl font-bold text-indigo-300 mb-2">
            Thanks for reading!
          </h3>
          <p className="text-gray-400">
            Enjoyed this post? Share it with your network or drop a comment
            below.
          </p>
        </div>

        {/* Related Blogs */}
        <RelatedBlog category={blog.category} blogid={blog._id} />

        {/* Comments Section Anchor */}
        <div id="comments" className="mt-12">
          {/* Render your comment form and list here */}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
