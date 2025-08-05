"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FaSpinner,
  FaEnvelope,
  FaGithubSquare,
  FaBookOpen,
  FaRegEdit,
  FaPlus,
  FaSignOutAlt,
  FaRobot,
  FaCommentDots,
  FaEye,
  FaHeart,
  FaChartLine,
  FaEllipsisV,
  FaArrowRight,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ContextMenu } from "@/v2Components/ContextMenu";
import DraftTab from "./DraftTab";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [stats, setStats] = useState({
    blogCount: 0,
    viewCount: 0,
    likeCount: 0,
    recentComments: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("blogs"); // 'blogs' or 'analytics'

  const isAdmin = session?.user?.role === "admin" || false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `/api/v2/dashboard/${session.user.email}`
          );
          const { profile, blogs, drafts, stats } = res.data;

          if (!profile) {
            toast.error("Profile not found.");
            setLoading(false);
            return;
          }

          setProfile(profile);
          setBlogs(blogs);
          setDrafts(drafts);
          setStats(stats);
        } catch (err) {
          toast.error("Failed to fetch dashboard data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-indigo-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl" />
        </motion.div>
        <motion.p
          className="ml-4 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading your dashboard...
        </motion.p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <FaSpinner className="animate-spin text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">
          Profile not found
        </h2>
        <p className="text-gray-400 mb-6 max-w-md text-center">
          We couldn't load your profile. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      {/* Floating particles */}
      <div className="fixed top-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse z-0"></div>
      <div className="fixed top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse z-0"></div>
      <div className="fixed bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse z-0"></div>

      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
            <FaChartLine className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-indigo-300">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 px-3 py-2 rounded-lg text-red-300 hover:text-white transition-colors"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          <Link
            href={`/v2/profile/${profile.email}`}
            className="flex items-center gap-2"
          >
            <img
              src={profile.image || "https://avatar.vercel.sh/username"}
              alt={profile.name}
              className="w-8 h-8 rounded-full border-2 border-indigo-500/50"
            />
            <span className="hidden md:inline text-sm text-gray-300 truncate max-w-[100px]">
              {profile.name}
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-2xl border border-indigo-500/30 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-bold text-indigo-300 mb-2">
                Welcome back, {profile.name.split(" ")[0]}!
              </h2>
              <p className="text-gray-400">
                Here's what's happening with your content
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/v2/blogs/create"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
              >
                <FaPlus /> Create Blog
              </Link>
              <Link
                href="/ai-tools"
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-white"
              >
                <FaRobot /> AI Assistant
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "blogs"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Your Blogs
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "analytics"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("drafts")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "drafts"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "blogs" && <BlogsTab blogs={blogs} />}
            {activeTab === "analytics" && <AnalyticsTab stats={stats} />}
            {activeTab === "drafts" && <DraftTab drafts={drafts} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const BlogsTab = ({ blogs }) => {
  return (
    <div>
      {blogs.length === 0 ? (
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaBookOpen className="text-indigo-400 text-5xl mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-300 mb-3">
            No blogs created yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Start sharing your knowledge with the world. Create your first blog
            post!
          </p>
          <Link
            href="/v2/blogs/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
          >
            <FaPlus /> Create Your First Blog
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <ContextMenu blogId={blog._id} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex justify-between text-xs text-white">
                    <span className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                      <FaEye /> {blog.views || 0}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                      <FaHeart /> {blog.likes || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white truncate">
                    {blog.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-indigo-600/30 text-indigo-200 font-semibold px-2 py-1 rounded">
                    {blog.category}
                  </span>
                  <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                    {dayjs(blog.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>

                <Link
                  href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                  className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View Blog <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const AnalyticsTab = ({ stats }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Blogs"
          value={stats.blogCount}
          icon={<FaBookOpen />}
          color="indigo"
        />
        <AnalyticsCard
          title="Total Views"
          value={stats.viewCount}
          icon={<FaEye />}
          color="green"
        />
        <AnalyticsCard
          title="Total Likes"
          value={stats.likeCount}
          icon={<FaHeart />}
          color="red"
        />
        <AnalyticsCard
          title="Recent Comments"
          value={stats.recentComments.length}
          icon={<FaCommentDots />}
          color="yellow"
        />
      </div>

      {stats.recentComments.length > 0 && (
        <motion.div
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center gap-2">
            <FaCommentDots className="text-indigo-400" /> Recent Comments
          </h3>

          <div className="space-y-4">
            {stats.recentComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-gray-300 mb-1">{comment.text}</p>
                    <p className="text-xs text-gray-500">
                      By {comment.author} on{" "}
                      {dayjs(comment.createdAt).format("MMM D")}
                    </p>
                  </div>
                  <Link
                    href={`/v2/blogs/${comment.blogSlug}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    View Post
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AnalyticsCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-900/20 text-indigo-400 border-indigo-800",
    green: "bg-green-900/20 text-green-400 border-green-800",
    red: "bg-red-900/20 text-red-400 border-red-800",
    yellow: "bg-yellow-900/20 text-yellow-400 border-yellow-800",
  };

  return (
    <motion.div
      className={`p-5 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/10">{icon}</div>
      </div>
    </motion.div>
  );
};
