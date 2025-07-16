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
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import RelatedBlog from "./RelatedBlogs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime);

const BlogDetails = ({ category, title, slug }) => {
  const pathname = usePathname();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postInteractionState, setPostInteractionState] = useState({});
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
          setLiked(res.data.liked);
          const initialInteractionState = {};
          initialInteractionState[res.data.blog._id] = {
            comments: [],
            showComments: false,
            loadingComments: false,
            commentInput: "",
          };
          setPostInteractionState(initialInteractionState);
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

  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  const handleLike = async () => {
    setLikeLoading("Loading");

    if (status === "unauthenticated") {
      toast.error("Please login first");
      setLikeLoading("");
    } else if (status === "authenticated") {
      try {
        const res = await axios.post(`/api/blog/${category}/${title}/${slug}`);
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      } catch (err) {
        toast.error("Failed to like the Blog.", err);
      } finally {
        setLikeLoading("");
      }
    }
  };

  // Function to fetch comments for a specific post
  const fetchComments = async (blogId) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        loadingComments: true,
        showComments: true, // Always show comments area when fetching
      },
    }));
    try {
      const res = await axios.get(`/api/blog/comments?blogId=${blogId}`);
      setPostInteractionState((prevState) => ({
        ...prevState,
        [blogId]: {
          ...prevState[blogId],
          comments: res.data,
          loadingComments: false,
        },
      }));
    } catch (err) {
      toast.error("Error loading comments. Please try again.");
      setPostInteractionState((prevState) => ({
        ...prevState,
        [blogId]: {
          ...prevState[blogId],
          loadingComments: false,
          showComments: false, // Hide comments if loading fails
        },
      }));
    }
  };

  // Toggle comment section visibility and fetch if not already fetched
  const handleToggleComments = (blogId) => {
    setPostInteractionState((prevState) => {
      const newState = { ...prevState };
      const currentPostState = newState[blogId];

      if (
        !currentPostState?.showComments &&
        currentPostState.comments.length === 0 &&
        !currentPostState.loadingComments
      ) {
        // If comments are not shown, not loaded, and not currently loading, fetch them
        fetchComments(blogId);
      } else {
        // Otherwise, just toggle visibility
        newState[blogId] = {
          ...currentPostState,
          showComments: !currentPostState.showComments,
        };
      }
      return newState;
    });
  };

  // Handle comment input change
  const handleCommentInputChange = (blogId, value) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        commentInput: value,
      },
    }));
  };

  if(status === "authenticated") {
  const handleCommentSubmit = async (e, blogId) => {
    e.preventDefault();
    const commentText = postInteractionState[blogId]?.commentInput.trim();

    if (!commentText) {
      toast.error("Comment cannot be empty.");
      return;
    }

    // Optimistic update: Add a temporary comment to the UI
    const tempCommentId = `temp-${Date.now()}`;
    const newComment = {
      _id: tempCommentId,
      text: commentText,
      createdAt: new Date().toISOString(),
      isTemp: true, // Mark as temporary
    };

    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        comments: [newComment, ...(prevState[blogId]?.comments || [])], // Add to the beginning
        commentInput: "", // Clear input immediately
        showComments: true, // Ensure comments are visible
      },
    }));

    try {
      const res = await axios.post("/api/blog/comments/create", {
        blogId,
        text: commentText,
      });

      if (res.status === 201) {
        toast.success("Comment posted successfully!");
        // Replace temporary comment with actual one from response
        setPostInteractionState((prevState) => ({
          ...prevState,
          [blogId]: {
            ...prevState[blogId],
            comments: prevState[blogId].comments.map((c) =>
              c._id === tempCommentId ? { ...res.data, isTemp: false } : c
            ),
          },
        }));
      } else {
        toast.error("Failed to post comment. Please try again.");
        // Revert optimistic update on failure
        setPostInteractionState((prevState) => ({
          ...prevState,
          [blogId]: {
            ...prevState[blogId],
            comments: prevState[blogId].comments.filter(
              (c) => c._id !== tempCommentId
            ),
          },
        }));
      }
    } catch (err) {
      toast.error("Error posting comment. Please try again.");
      // Revert optimistic update on error
      setPostInteractionState((prevState) => ({
        ...prevState,
        [blogId]: {
          ...prevState[blogId],
          comments: prevState[blogId].comments.filter(
            (c) => c._id !== tempCommentId
          ),
        },
      }));
    }
  };
} else if(status === "unauthenticated"){
  toast.error("Please login first")
}

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
              <FaSpinner className="animate-spin" />
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
          <button
            onClick={() => handleToggleComments(blog._id)}
            className="flex items-center gap-2 text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md transition"
          >
            <FaCommentDots /> Comment
          </button>
        </div>

        {postInteractionState[blog._id]?.showComments && (
          <div className="mt-5 pt-4 border-t border-gray-800">
            {/* Comment Input */}
            <form
              onSubmit={(e) => handleCommentSubmit(e, blog._id)}
              className="flex items-center gap-3 mb-4"
            >
              <input
                name="comment"
                type="text"
                placeholder="Write a comment..."
                value={postInteractionState[blog._id]?.commentInput || ""}
                onChange={(e) =>
                  handleCommentInputChange(blog._id, e.target.value)
                }
                className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-full text-sm outline-none border border-gray-700 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-full flex items-center gap-1 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                disabled={postInteractionState[blog._id]?.loadingComments}
              >
                {postInteractionState[blog._id]?.loadingComments ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                <span className="hidden sm:inline">Post</span>
              </button>
            </form>

            {/* Comment List */}
            {postInteractionState[blog._id]?.loadingComments ? (
              <div className="flex justify-center items-center py-4">
                <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
                <p className="ml-3 text-gray-400">Loading comments...</p>
              </div>
            ) : postInteractionState[blog._id]?.comments.length > 0 ? (
              <div className="mt-3 space-y-3">
                {postInteractionState[blog._id]?.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className={`bg-gray-800 px-4 py-3 rounded-lg text-sm text-gray-200 shadow-sm ${
                      comment.isTemp
                        ? "opacity-70 border border-dashed border-indigo-500"
                        : ""
                    }`}
                  >
                    <p className="mb-1 leading-snug">{comment.text}</p>
                    <div className="text-xs text-gray-400">
                      {dayjs(comment.createdAt).fromNow()}
                      {comment.isTemp && (
                        <span className="ml-2 text-indigo-400">
                          (Sending...)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default BlogDetails;
