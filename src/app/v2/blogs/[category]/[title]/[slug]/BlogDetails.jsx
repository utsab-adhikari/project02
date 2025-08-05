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
import Link from "next/link";
import RelatedBlog from "./RelatedBlogs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

// Component for the blog header section
const BlogHeader = ({ blog, author, likes, views }) => (
  <header className="space-y-6">
    {blog.featuredImage ? (
      <img
        src={blog.featuredImage}
        alt={`Featured image for ${blog.title}`}
        className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-[1.01]"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-64 sm:h-80 bg-gray-800 flex items-center justify-center rounded-xl border border-gray-700">
        <span className="text-gray-500 font-medium">No Featured Image</span>
      </div>
    )}
    <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mt-6">
      {blog.title}
    </h1>
    <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
      <span className="flex items-center gap-1.5">
        <FaTag className="text-indigo-400" /> {blog.category}
      </span>
      <span className="flex items-center gap-1.5">
        <FaCalendarAlt className="text-indigo-400" />{" "}
        {dayjs(blog.createdAt).format("MMM DD, YYYY")}
      </span>
      <span className="flex items-center gap-1.5">
        <FaEye className="text-indigo-400" /> {views}
      </span>
      <span className="flex items-center gap-1.5">
        <FaHeart className="text-indigo-400" /> {likes}
      </span>
    </div>
    {author && (
      <Link
        href={`/profile/${author.email}`}
        className="flex items-center gap-3 transition-colors duration-200 hover:text-indigo-400"
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

// Component for the main blog content
const BlogContent = ({ blog }) => (
  <article
    className="prose prose-xl dark:prose-invert text-gray-200 leading-relaxed"
    dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
  />
);

// Component for blog actions
const BlogActions = ({
  liked,
  likes,
  isLikeLoading,
  handleLike,
  commentsCount,
}) => (
  <div className="flex flex-wrap items-center gap-4 mt-8 border-t border-gray-700 pt-6">
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 text-white px-4 py-2 rounded-full transition-all duration-300 transform ${
        liked
          ? "bg-red-600 hover:bg-red-700"
          : "bg-indigo-600 hover:bg-indigo-700"
      } ${
        isLikeLoading === "Loading" ? "opacity-70 cursor-not-allowed" : ""
      }`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      disabled={isLikeLoading === "Loading"}
    >
      {isLikeLoading === "Loading" ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <FaHeart />
      )}
      <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
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
      <FaShareAlt /> Share
    </button>
    <button
      className="flex items-center gap-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-colors"
      aria-label="View comments"
    >
      <FaCommentDots /> {commentsCount} Comments
    </button>
  </div>
);

// Component for comments section
const CommentsSection = ({
  blogId,
  comments,
  loadingComments,
  commentInput,
  handleCommentInputChange,
  handleCommentSubmit,
  session,
}) => (
  <div id="comments-section" className="mt-8 pt-4 border-t border-gray-800">
    <h3 className="text-2xl font-bold text-white mb-6">Comments</h3>
    <form
      onSubmit={(e) => handleCommentSubmit(e, blogId)}
      className="flex items-center gap-3 mb-6"
    >
      <div className="flex-1 relative">
        <input
          name="comment"
          type="text"
          placeholder={
            session ? "Write a comment..." : "Please log in to comment"
          }
          value={commentInput}
          onChange={(e) => handleCommentInputChange(blogId, e.target.value)}
          className="w-full bg-gray-800 text-white px-4 pr-12 py-3 rounded-full text-sm outline-none border border-gray-700 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
          aria-label="Write a comment"
          disabled={!session}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:bg-gray-600"
          disabled={!session || loadingComments || !commentInput.trim()}
          aria-label="Post comment"
        >
          {loadingComments ? (
            <FaSpinner className="animate-spin text-white" />
          ) : (
            <FaPaperPlane className="text-sm" />
          )}
        </button>
      </div>
    </form>
    {loadingComments ? (
      <div className="flex flex-col items-center justify-center py-8">
        <FaSpinner className="animate-spin text-indigo-500 text-3xl" />
        <p className="ml-3 text-gray-400 mt-3">Loading comments...</p>
      </div>
    ) : comments.length > 0 ? (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className={`bg-gray-800 p-4 rounded-xl text-sm shadow-sm transition-opacity duration-300 ${
              comment.isTemp
                ? "opacity-60 border border-dashed border-indigo-500"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-2">
              <Link
                href={`/profile/${comment.authorEmail}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={
                    comment.authorImg ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                  }
                  alt={`${comment.author}'s avatar`}
                  className="w-8 h-8 rounded-full object-cover border border-gray-700"
                />
                <span className="text-gray-300 font-medium group-hover:text-indigo-400">
                  {comment.author}
                </span>
              </Link>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {dayjs(comment.createdAt).fromNow()}
              </div>
            </div>
            <p className="text-gray-200 leading-snug">{comment.text}</p>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-6 bg-gray-800/50 rounded-xl">
        <p className="text-gray-500 text-sm">
          No comments yet. Be the first to share your thoughts!
        </p>
      </div>
    )}
  </div>
);

// Main BlogDetails component
const BlogDetails = ({ category, title, slug }) => {
  const pathname = usePathname();
  const [blog, setBlog] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postInteractionState, setPostInteractionState] = useState({});
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLikeLoading, setLikeLoading] = useState("");
  const [commentsCount, setCommentsCount] = useState(0);

  const { data: session, status } = useSession();

  // Fetches blog details and comments on initial load
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const res = await axios.get(`/api/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          const fetchedBlog = res.data.blog;
          setBlog(fetchedBlog);
          setAuthor(res.data.author);
          setLikes(fetchedBlog.likes || 0);
          setViews(fetchedBlog.views || 0);
          setLiked(res.data.liked);
          setCommentsCount(fetchedBlog.commentsCount || 0);

          // Initialize comments section state
          setPostInteractionState({
            [fetchedBlog._id]: {
              comments: [],
              loadingComments: false,
              commentInput: "",
            },
          });
          fetchComments(fetchedBlog._id); // Auto-fetch comments
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
    fetchBlogAndComments();
  }, [category, title, slug, session]);

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
      toast.error("Please login first to like.");
      setLikeLoading("");
      return;
    }
    try {
      const res = await axios.post(`/api/blog/${category}/${title}/${slug}`);
      setLikes(res.data.likes);
      setLiked(res.data.liked);
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to update like status.");
      console.error(err);
    } finally {
      setLikeLoading("");
    }
  };

  const fetchComments = async (blogId) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        loadingComments: true,
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
      setCommentsCount(res.data.length);
    } catch (err) {
      toast.error("Error loading comments. Please try again.");
      setPostInteractionState((prevState) => ({
        ...prevState,
        [blogId]: {
          ...prevState[blogId],
          loadingComments: false,
        },
      }));
    }
  };

  const handleCommentInputChange = (blogId, value) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        commentInput: value,
      },
    }));
  };

  const handleCommentSubmit = async (e, blogId) => {
    e.preventDefault();
    if (status === "unauthenticated") {
      toast.error("Please login first to post a comment.");
      return;
    }
    const commentText = postInteractionState[blogId]?.commentInput.trim();
    if (!commentText) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const tempCommentId = `temp-${Date.now()}`;
    const newComment = {
      _id: tempCommentId,
      text: commentText,
      createdAt: new Date().toISOString(),
      author: session?.user?.name || "Anonymous",
      authorEmail: session?.user?.email,
      authorImg: session?.user?.image,
      isTemp: true,
    };

    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        comments: [newComment, ...prevState[blogId].comments],
        commentInput: "",
      },
    }));

    try {
      const res = await axios.post("/api/blog/comments/create", {
        blogId,
        text: commentText,
      });

      if (res.status === 201) {
        toast.success("Comment posted successfully!");
        setPostInteractionState((prevState) => ({
          ...prevState,
          [blogId]: {
            ...prevState[blogId],
            comments: prevState[blogId].comments.map((c) =>
              c._id === tempCommentId ? { ...res.data, isTemp: false } : c
            ),
          },
        }));
        setCommentsCount((prev) => prev + 1);
      } else {
        toast.error("Failed to post comment. Please try again.");
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

  if (loading) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center bg-gray-950">
        <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-4" />
        <p className="text-xl text-gray-400">Loading blog details...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen text-red-400 flex flex-col items-center justify-center bg-gray-950">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <p className="text-xl font-semibold">Blog not found.</p>
        <p className="text-gray-400 text-center">
          This article might have been removed.
        </p>
      </div>
    );
  }

  const currentBlogId = blog._id;
  const currentPostState = postInteractionState[currentBlogId] || {
    comments: [],
    loadingComments: false,
    commentInput: "",
  };

  return (
    <div className="min-h-screen text-white py-12 bg-gray-950">
      <div className="px-6 mx-auto space-y-12">
        <BlogHeader blog={blog} author={author} likes={likes} views={views} />
        <div className="space-y-10">
          <BlogContent blog={blog} />
          <BlogActions
            liked={liked}
            likes={likes}
            isLikeLoading={isLikeLoading}
            handleLike={handleLike}
            commentsCount={commentsCount}
          />
          <CommentsSection
            blogId={currentBlogId}
            comments={currentPostState.comments}
            loadingComments={currentPostState.loadingComments}
            commentInput={currentPostState.commentInput}
            handleCommentInputChange={handleCommentInputChange}
            handleCommentSubmit={handleCommentSubmit}
            session={session}
          />
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <h3 className="text-2xl font-bold text-indigo-300 mb-2">
            Thanks for reading!
          </h3>
          <p className="text-gray-400">
            Enjoyed this post? Share it with your network or drop a comment
            below.
          </p>
        </div>
        <RelatedBlog category={blog.category} blogid={blog._id} />
      </div>
    </div>
  );
};

export default BlogDetails;