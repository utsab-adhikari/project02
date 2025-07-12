"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast, Toaster } from "react-hot-toast"; // Import Toaster for notifications
import {
  FaThumbsUp,
  FaCommentAlt,
  FaShare,
  FaPlus,
  FaSpinner, // For loading indicators
  FaPaperPlane, // For send button
} from "react-icons/fa";
import Link from "next/link"; // Assuming Next.js Link component

dayjs.extend(relativeTime);

const PostsView = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  // State to manage comments and their loading/visibility per post
  const [postInteractionState, setPostInteractionState] = useState({}); // { postId: { comments: [], showComments: false, loadingComments: false, commentInput: '' } }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/post", {
          withCredentials: true,
        });
        setPosts(res.data.posts || []);
        // Initialize interaction state for each post
        const initialInteractionState = {};
        (res.data.posts || []).forEach((post) => {
          initialInteractionState[post._id] = {
            comments: [],
            showComments: false,
            loadingComments: false,
            commentInput: "",
          };
        });
        setPostInteractionState(initialInteractionState);
      } catch (error) {
        toast.error("Failed to load posts. Please try again.");
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to fetch comments for a specific post
  const fetchComments = async (postId) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        loadingComments: true,
        showComments: true, // Always show comments area when fetching
      },
    }));
    try {
      const res = await axios.get(`/api/post/comments?postId=${postId}`);
      setPostInteractionState((prevState) => ({
        ...prevState,
        [postId]: {
          ...prevState[postId],
          comments: res.data,
          loadingComments: false,
        },
      }));
    } catch (err) {
      toast.error("Error loading comments. Please try again.");
      setPostInteractionState((prevState) => ({
        ...prevState,
        [postId]: {
          ...prevState[postId],
          loadingComments: false,
          showComments: false, // Hide comments if loading fails
        },
      }));
    }
  };

  // Toggle comment section visibility and fetch if not already fetched
  const handleToggleComments = (postId) => {
    setPostInteractionState((prevState) => {
      const newState = { ...prevState };
      const currentPostState = newState[postId];

      if (
        !currentPostState.showComments &&
        currentPostState.comments.length === 0 &&
        !currentPostState.loadingComments
      ) {
        // If comments are not shown, not loaded, and not currently loading, fetch them
        fetchComments(postId);
      } else {
        // Otherwise, just toggle visibility
        newState[postId] = {
          ...currentPostState,
          showComments: !currentPostState.showComments,
        };
      }
      return newState;
    });
  };

  // Handle comment input change
  const handleCommentInputChange = (postId, value) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [postId]: {
        ...prevState[postId],
        commentInput: value,
      },
    }));
  };

  // Handle comment submission
  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentText = postInteractionState[postId]?.commentInput.trim();

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
      [postId]: {
        ...prevState[postId],
        comments: [newComment, ...(prevState[postId]?.comments || [])], // Add to the beginning
        commentInput: "", // Clear input immediately
        showComments: true, // Ensure comments are visible
      },
    }));

    try {
      const res = await axios.post("/api/post/comments/create", {
        postId,
        text: commentText,
      });

      if (res.status === 201) {
        toast.success("Comment posted successfully!");
        // Replace temporary comment with actual one from response
        setPostInteractionState((prevState) => ({
          ...prevState,
          [postId]: {
            ...prevState[postId],
            comments: prevState[postId].comments.map((c) =>
              c._id === tempCommentId ? { ...res.data, isTemp: false } : c
            ),
          },
        }));
      } else {
        toast.error("Failed to post comment. Please try again.");
        // Revert optimistic update on failure
        setPostInteractionState((prevState) => ({
          ...prevState,
          [postId]: {
            ...prevState[postId],
            comments: prevState[postId].comments.filter(
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
        [postId]: {
          ...prevState[postId],
          comments: prevState[postId].comments.filter(
            (c) => c._id !== tempCommentId
          ),
        },
      }));
    }
  };  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 relative font-inter">

      <Link
        href="/posts/create"
        className="fixed top-6 right-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-50 transition"
      >
        <FaPlus /> Create Post
      </Link>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-indigo-400">
          Community Feed
        </h2>

        {loadingPosts ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-indigo-500 text-4xl" />
            <p className="ml-4 text-gray-400 text-lg">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 bg-[#1e1f21] rounded-xl shadow-lg border border-[#333]">
            <p className="text-red-400 text-lg font-medium">
              No posts available yet. Be the first to create one!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-[#1e1f21] rounded-xl shadow-2xl p-5 mb-8 border border-gray-700 hover:border-indigo-500 transition-all duration-300 ease-in-out"
            >
              {/* Post Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    post.author
                  )}&backgroundColor=indigo,blue,purple&fontFamily=Inter&chars=2`}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/40x40/333333/FFFFFF?text=User";
                  }} // Fallback
                />
                <div>
                  <p className="text-white font-bold text-base">
                    {post.author}
                  </p>
                  <p className="text-xs text-gray-400">
                    {dayjs(post.createdAt).fromNow()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="text-gray-200 text-base mb-4 whitespace-pre-line leading-relaxed">
                {post.postcontent}
              </div>

              {/* Image */}
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt="Featured"
                  className="rounded-lg mb-4 w-full object-cover max-h-80 sm:max-h-96 shadow-md border border-gray-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x300/333333/FFFFFF?text=Image+Unavailable";
                  }} // Fallback
                />
              )}

              {/* Post Actions */}
              <div className="flex justify-around text-sm text-gray-400 border-t border-gray-700 pt-3 mt-4">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  <FaThumbsUp className="text-lg" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => handleToggleComments(post._id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <FaCommentAlt className="text-lg" />
                  <span>Comments</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-indigo-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                  <FaShare className="text-lg" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comment Section */}
              {postInteractionState[post._id]?.showComments && (
                <div className="mt-5 pt-4 border-t border-gray-800">
                  {/* Comment Input */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    className="flex items-center gap-3 mb-4"
                  >
                    <input
                      name="comment"
                      type="text"
                      placeholder="Write a comment..."
                      value={postInteractionState[post._id]?.commentInput || ""}
                      onChange={(e) =>
                        handleCommentInputChange(post._id, e.target.value)
                      }
                      className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-full text-sm outline-none border border-gray-700 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2.5 rounded-full flex items-center gap-1 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      disabled={postInteractionState[post._id]?.loadingComments}
                    >
                      {postInteractionState[post._id]?.loadingComments ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaPaperPlane />
                      )}
                      <span className="hidden sm:inline">Post</span>
                    </button>
                  </form>

                  {/* Comment List */}
                  {postInteractionState[post._id]?.loadingComments ? (
                    <div className="flex justify-center items-center py-4">
                      <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
                      <p className="ml-3 text-gray-400">Loading comments...</p>
                    </div>
                  ) : postInteractionState[post._id]?.comments.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {postInteractionState[post._id]?.comments.map(
                        (comment) => (
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
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostsView;
