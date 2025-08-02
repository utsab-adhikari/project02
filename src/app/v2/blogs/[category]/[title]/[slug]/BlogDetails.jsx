"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
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
  FaBookmark,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaLink,
  FaRegClock
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion, AnimatePresence } from "framer-motion";

import RelatedBlog from "./RelatedBlogs";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
  const [readingTime, setReadingTime] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/v2/blog/${category}/${title}/${slug}`);
        if (res.data?.blog) {
          setBlog(res.data.blog);
          setAuthor(res.data.author);
          setLikes(res.data.blog.likes || 0);
          setViews(res.data.blog.views || 0);
          setLiked(res.data.liked);
          
          // Calculate reading time
          const words = res.data.blog.blogcontent.split(/\s+/).length;
          const time = Math.ceil(words / 200); // 200 wpm
          setReadingTime(time);
          
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
    
    // Scroll progress
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollTop = window.scrollY;
      const contentHeight = contentRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = scrollTop / (contentHeight - windowHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLike = async () => {
    setLikeLoading("Loading");

    if (status === "unauthenticated") {
      toast.error("Please login first");
      setLikeLoading("");
    } else if (status === "authenticated") {
      try {
        const res = await axios.post(`/api/v2/blog/${category}/${title}/${slug}`);
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      } catch (err) {
        toast.error("Failed to like the Blog.", err);
      } finally {
        setLikeLoading("");
      }
    }
  };

  const toggleBookmark = () => {
    if (status === "unauthenticated") {
      toast.error("Please login to bookmark");
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks");
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const shareToPlatform = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(blog.title);
    
    let shareUrl = "";
    switch(platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case "copy":
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
        return;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
    setShowShareOptions(false);
  };

  // Function to fetch comments for a specific post
  const fetchComments = async (blogId) => {
    setPostInteractionState((prevState) => ({
      ...prevState,
      [blogId]: {
        ...prevState[blogId],
        loadingComments: true,
        showComments: true,
      },
    }));
    try {
      const res = await axios.get(`/api/v2/blog/comments?blogId=${blogId}`);
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
          showComments: false,
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
        fetchComments(blogId);
      } else {
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

  const handleCommentSubmit = async (e, blogId) => {
    if (status === "authenticated") {
      e.preventDefault();
      const commentText = postInteractionState[blogId]?.commentInput.trim();

      if (!commentText) {
        toast.error("Comment cannot be empty.");
        return;
      }

      // Optimistic update
      const tempCommentId = `temp-${Date.now()}`;
      const newComment = {
        _id: tempCommentId,
        text: commentText,
        createdAt: new Date().toISOString(),
        isTemp: true,
        author: session.user.name,
        authorEmail: session.user.email,
        authorImg: session.user.image,
      };

      setPostInteractionState((prevState) => ({
        ...prevState,
        [blogId]: {
          ...prevState[blogId],
          comments: [newComment, ...(prevState[blogId]?.comments || [])],
          commentInput: "",
          showComments: true,
        },
      }));

      try {
        const res = await axios.post("/api/v2/blog/comments/create", {
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
    } else if (status === "unauthenticated") {
      toast.error("Please login first");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-indigo-500 text-6xl" />
        </motion.div>
        <motion.p 
          className="mt-6 text-xl text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading blog content...
        </motion.p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">Blog not found</h2>
        <p className="text-gray-400 mb-6 max-w-md text-center">
          The article you're looking for might have been removed or doesn't exist.
        </p>
        <Link 
          href="/v2/blogs" 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Browse All Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-800 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with category and breadcrumb */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link 
              href="/v2/blogs" 
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Blogs
            </Link>
            <span className="text-gray-500">/</span>
            <Link 
              href={`/v2/blogs/${blog.category}`} 
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              {blog.category}
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400 truncate">{blog.title}</span>
          </div>
          
          <motion.div 
            className="inline-block px-4 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {blog.category}
          </motion.div>
        </div>

        {/* Featured Image */}
        {blog.featuredImage ? (
          <motion.img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-72 md:h-96 object-cover rounded-xl shadow-xl border border-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-72 md:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-xl border border-gray-700 mb-8">
            <span className="text-gray-500">No Featured Image</span>
          </div>
        )}

        {/* Title and Metadata */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-400" />
              <span>{dayjs(blog.createdAt).format("MMM DD, YYYY")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock className="text-indigo-400" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-indigo-400" />
              <span>{views} views</span>
            </div>
          </div>
          
          {/* Author Info */}
          {author && (
            <Link 
              href={`/v2/profile/${author.email}`} 
              className="flex items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-indigo-500 transition-colors w-full max-w-md"
            >
              <img
                src={author.image}
                alt={author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
              />
              <div>
                <p className="font-medium text-white">{author.name}</p>
                <p className="text-gray-400 text-sm">{author.bio || "Blog author"}</p>
              </div>
            </Link>
          )}
        </motion.div>

        {/* Blog Content */}
        <motion.article 
          ref={contentRef}
          className="prose prose-lg prose-invert text-gray-200 max-w-none mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div dangerouslySetInnerHTML={{ __html: blog.blogcontent }} />
        </motion.article>

        {/* Engagement Section */}
        <motion.div 
          className="flex flex-wrap items-center gap-4 mb-12 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition ${
                liked ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {isLikeLoading === "Loading" ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaHeart className={liked ? "text-red-500" : ""} />
              )}
              <span>{liked ? "Liked" : "Like"} • {likes}</span>
            </button>
            
            <button
              onClick={toggleShareOptions}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
            >
              <FaShareAlt />
              <span>Share</span>
            </button>
            
            <button
              onClick={() => handleToggleComments(blog._id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
            >
              <FaCommentDots />
              <span>Comments</span>
            </button>
            
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition ${
                isBookmarked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <FaBookmark className={isBookmarked ? "text-indigo-400" : ""} />
              <span>{isBookmarked ? "Saved" : "Save"}</span>
            </button>
          </div>
          
          {/* Share Options */}
          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                className="mt-4 w-full p-4 bg-gray-800 rounded-lg"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-gray-300 mb-3">Share this post</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => shareToPlatform("twitter")} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
                  >
                    <FaTwitter /> Twitter
                  </button>
                  <button 
                    onClick={() => shareToPlatform("facebook")} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white"
                  >
                    <FaFacebook /> Facebook
                  </button>
                  <button 
                    onClick={() => shareToPlatform("linkedin")} 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    <FaLinkedin /> LinkedIn
                  </button>
                  <button 
                    onClick={() => shareToPlatform("copy")} 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
                  >
                    <FaLink /> Copy Link
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Comments Section */}
        {postInteractionState[blog._id]?.showComments && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Comments</h2>
              <span className="text-gray-400">
                {postInteractionState[blog._id]?.comments.length || 0} comments
              </span>
            </div>
            
            {/* Comment Input */}
            <form
              onSubmit={(e) => handleCommentSubmit(e, blog._id)}
              className="flex items-center gap-3 mb-8"
            >
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
              )}
              <input
                name="comment"
                type="text"
                placeholder="Share your thoughts..."
                value={postInteractionState[blog._id]?.commentInput || ""}
                onChange={(e) =>
                  handleCommentInputChange(blog._id, e.target.value)
                }
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 transition-colors duration-200 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-3 rounded-xl flex items-center gap-1 transition-all duration-300"
                disabled={postInteractionState[blog._id]?.loadingComments}
              >
                {postInteractionState[blog._id]?.loadingComments ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </form>

            {/* Comment List */}
            {postInteractionState[blog._id]?.loadingComments ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-indigo-500 text-2xl" />
                <p className="ml-3 text-gray-400">Loading comments...</p>
              </div>
            ) : postInteractionState[blog._id]?.comments.length > 0 ? (
              <div className="space-y-6">
                {postInteractionState[blog._id]?.comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    className={`bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl border ${
                      comment.isTemp 
                        ? "border-dashed border-indigo-500" 
                        : "border-gray-800"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-4 mb-3">
                      <img
                        src={comment.authorImg}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover border border-gray-600"
                      />
                      <div>
                        <p className="font-medium text-white">{comment.author}</p>
                        <p className="text-xs text-gray-400">
                          {dayjs(comment.createdAt).fromNow()}
                          {comment.isTemp && (
                            <span className="ml-2 text-indigo-400">
                              (Sending...)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 ml-14">{comment.text}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-900/30 rounded-xl">
                <FaCommentDots className="text-indigo-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-400">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Thank You / CTA */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-8 rounded-xl border border-indigo-500/30 text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-indigo-300 mb-3">
            Thanks for reading!
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you found this article valuable, please consider sharing it with your network.
            Your support helps us create more content you'll love.
          </p>
          <button
            onClick={toggleShareOptions}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white flex items-center gap-2 mx-auto"
          >
            <FaShareAlt /> Share This Article
          </button>
        </motion.div>

        {/* Related Blogs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <RelatedBlog category={blog.category} blogid={blog._id} />
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetails;