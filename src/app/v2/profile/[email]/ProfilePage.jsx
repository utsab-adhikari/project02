"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "next/navigation";
import {
  FaSpinner,
  FaEnvelope,
  FaShareAlt,
  FaRegEdit,
  FaEye,
  FaHeart,
  FaRegFolder,
  FaRegClock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaSquareFacebook, FaSquareGithub } from "react-icons/fa6";
import { useSession } from "next-auth/react";

// Main Profile Page Component
export default function App() {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!email) return;

    const getProfileAndBlogs = async () => {
      setLoadingProfile(true);
      setLoadingBlogs(true);
      try {
        const res = await axios.get(`/api/v2/profile/${email}`, {
          withCredentials: true,
        });
        if (!res?.data?.profile) {
          toast.error("Profile not found.");
          setProfile(null);
          setBlogs([]);
        } else {
          setProfile(res.data.profile);
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error("Profile data fetch error:", err);
        setProfile(null);
        setBlogs([]);
      } finally {
        setLoadingProfile(false);
        setLoadingBlogs(false);
      }
    };

    getProfileAndBlogs();
  }, [email]);

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400">
        <FaSpinner className="animate-spin text-5xl mr-4" />
        <span className="text-xl font-medium">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-red-500 text-2xl font-semibold">
        Profile not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/222222/333333')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <img
            src={
              profile.image ||
              "https://placehold.co/150x150/222222/EEEEEE?text=Profile"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-500 shadow-2xl"
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            {profile.name}
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            {profile.bio || "A passionate writer sharing insights and stories."}
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {profile.email && (
              <Link
                href={`mailto:${profile.email}`}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex items-center gap-2 transition-all duration-300"
              >
                <FaEnvelope size={18} /> Email
              </Link>
            )}
            {profile.contact && (
              <Link
                href={`https://wa.me/${profile.contact}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white flex items-center gap-2 transition-all duration-300"
              >
                <IoLogoWhatsapp size={18} /> WhatsApp
              </Link>
            )}
          </div>
          <SocialLinks profile={profile} />
        </div>
      </section>

      {/* Blogs Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-indigo-400 mb-12 text-center tracking-tight">
          Latest Blogs
        </h2>
        <BlogsGrid
          blogs={blogs}
          loading={loadingBlogs}
          profileName={profile.name}
        />
      </section>
    </div>
  );
}

// Social Links Component
const SocialLinks = ({ profile }) => {
  const { data: session } = useSession();

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile`,
          text: `Check out ${profile.name}'s blogs!`,
          url: profileUrl,
        });
        toast.success("Profile shared successfully!");
      } catch (error) {
        toast.error("Failed to share profile.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied!");
      } catch (err) {
        toast.error("Failed to copy link.");
      }
    }
  };

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {profile.facebook && (
        <Link
          href={profile.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-blue-500 transition-colors"
        >
          <FaSquareFacebook size={24} />
        </Link>
      )}
      {profile.github && (
        <Link
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-gray-100 transition-colors"
        >
          <FaSquareGithub size={24} />
        </Link>
      )}
      {session?.user?.email === profile.email && (
        <Link
          href={`/v2/profile/${profile.email}/update`}
          className="text-gray-300 hover:text-indigo-400 transition-colors"
        >
          <FaRegEdit size={24} />
        </Link>
      )}
      <button
        onClick={handleShareProfile}
        className="text-gray-300 hover:text-purple-400 transition-colors"
      >
        <FaShareAlt size={24} />
      </button>
    </div>
  );
};

// Blogs Grid Component
const BlogsGrid = ({ blogs, loading, profileName }) => (
  <div>
    {loading ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    ) : blogs.length === 0 ? (
      <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
        <p className="text-gray-400 text-xl">
          No blogs found from {profileName} yet.
        </p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    )}
  </div>
);

// Blog Card Component
dayjs.extend(relativeTime);

const BlogCard = ({ blog }) => (
  <article className="h-full">
    <Link
      href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
      className="group flex flex-col h-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
      aria-label={`Read "${blog.title}" blog post`}
    >
      <div className="relative flex-shrink-0">
        <div className="aspect-video overflow-hidden">
          <img
            src={
              blog.featuredImage ||
              "https://placehold.co/600x400/222222/333333?text=Blog"
            }
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            width={600}
            height={400}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-indigo-600/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
            <FaRegFolder className="text-indigo-300" />
            {blog.category || "Uncategorized"}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <div className="flex items-center gap-3 text-white text-sm bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <FaEye className="text-indigo-300" size={14} />
              <span>{blog.views?.toLocaleString() || 0}</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-1.5">
              <FaHeart className="text-rose-400" size={14} />
              <span>{blog.likes?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <div className="mt-auto pt-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaRegClock size={12} />
            <time dateTime={blog.createdAt || new Date().toISOString()}>
              {blog.createdAt
                ? dayjs().diff(blog.createdAt, "day") <= 3
                  ? dayjs(blog.createdAt).fromNow()
                  : dayjs(blog.createdAt).format("MMMM D, YYYY")
                : "Recently"}
            </time>
          </div>

          <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">
            {blog.readingTime || "5 min read"}
          </span>
        </div>
      </div>
    </Link>
  </article>
);

// Blog Card Skeleton
const BlogCardSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
    <div className="w-full h-64 bg-gray-800"></div>
    <div className="p-6">
      <div className="h-7 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/3"></div>
    </div>
  </div>
);
