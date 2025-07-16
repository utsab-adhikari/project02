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
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import toast from "react-hot-toast";
import Link from "next/link";

// Main Dashboard Component
export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    // Redirect unauthenticated users
    if (status === "unauthenticated") {
      router.replace("/");
    }

    // Fetch profile and blogs when authenticated
    if (status === "authenticated") {
      const fetchDashboardData = async () => {
        try {
          const res = await axios.get(`/api/profile/${session.user.email}`);
          if (!res?.data?.profile) {
            toast.error("Profile not found.");
            return;
          }
          setProfile(res.data.profile);
          setBlogs(res.data.blogs || []);
        } catch (error) {
          toast.error("Failed to load dashboard.");
          console.error("Dashboard data fetch error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [status, router, session]); // Dependencies for useEffect

  // Show a full-screen loading spinner
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400">
        <FaSpinner className="animate-spin text-5xl mr-4" />
        <span className="text-xl font-medium">Loading dashboard...</span>
      </div>
    );
  }

  // Show an error message if profile data is not available
  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-red-500 text-2xl font-semibold">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-inter p-6 lg:p-10">
      {/* Header Section */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-4 bg-gray-900 rounded-xl shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-400 tracking-wide">
          Dashboard
        </h1>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-5 py-2 bg-red-700 hover:bg-red-800 rounded-full text-base font-semibold transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </header>

      {/* Profile Section */}
      <ProfileSection profile={profile} />

      {/* Action Cards Section */}
      <ActionCards isAdmin={isAdmin} />

      {/* Blog Posts Section */}
      <BlogList blogs={blogs} loading={loading} />
    </div>
  );
}

// Component for Profile Section
const ProfileSection = ({ profile }) => (
  <section className="bg-gray-900 p-8 rounded-2xl border border-indigo-700 max-w-7xl w-full mx-auto shadow-2xl mb-10 transform hover:scale-[1.005] transition-transform duration-300 ease-in-out">
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={
            profile.image ||
            "https://placehold.co/150x150/222222/EEEEEE?text=Profile"
          }
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover border-4 border-indigo-600 shadow-xl"
        />
        <span className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-900"></span>{" "}
        {/* Online indicator */}
      </div>

      {/* Profile Details */}
      <div className="flex-1 w-full text-center md:text-left">
        <h2 className="text-4xl font-extrabold text-indigo-300 mb-1 leading-tight">
          {profile.name}
        </h2>
        <p className="text-lg text-gray-400 mb-2">{profile.email}</p>
        <p className="text-sm text-gray-500 mb-4">
          Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
        </p>

        {profile.bio && (
          <p className="mt-4 italic text-gray-300 text-lg leading-relaxed">
            “{profile.bio}”
          </p>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
          {profile.facebook && (
            <Link
              href={profile.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
            >
              <FaSquareFacebook className="text-lg" /> Facebook
            </Link>
          )}
          {profile.github && (
            <Link
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
            >
              <FaGithubSquare className="text-lg" /> GitHub
            </Link>
          )}
          {profile.contact && (
            <Link
              href={`https://wa.me/${profile.contact}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
            >
              <IoLogoWhatsapp className="text-lg" /> WhatsApp
            </Link>
          )}
          <Link
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
          >
            <FaEnvelope className="text-lg" /> Email
          </Link>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
          <Link
            href={`/profile/${profile.email}`}
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center gap-2 text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaBookOpen /> View Profile
          </Link>
          <Link
            href={`/profile/${profile.email}/update`}
            className="px-7 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center gap-2 text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaRegEdit /> Update Profile
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Component for Action Cards
const ActionCards = ({ isAdmin }) => (
  <section className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
    <ActionCard
      href="/posts/create"
      bgColor="bg-indigo-700"
      hoverBgColor="hover:bg-indigo-800"
      icon={<FaPlus className="text-indigo-700 text-2xl" />}
      title="Create Post"
      description="Write a new blog post"
    />

    <ActionCard
      href="/blogs/create"
      bgColor="bg-pink-700"
      hoverBgColor="hover:bg-pink-800"
      icon={<FaPlus className="text-pink-700 text-2xl" />}
      title="Create Blog"
      description="Add a new blog category"
    />
    {isAdmin && (
      <>
        <ActionCard
          href="/blogs/category/create"
          bgColor="bg-teal-700"
          hoverBgColor="hover:bg-teal-800"
          icon={<FaPlus className="text-teal-700 text-2xl" />}
          title="Create Category"
          description="Organize content with new categories"
        />
      </>
    )}
  </section>
);

// Reusable Action Card Component
const ActionCard = ({
  href,
  bgColor,
  hoverBgColor,
  icon,
  title,
  description,
}) => (
  <Link
    href={href}
    className={`${bgColor} ${hoverBgColor} p-6 rounded-xl flex items-center gap-5 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
  >
    <div className="p-3 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-xl mb-1">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  </Link>
);

// Component for Blog List
const BlogList = ({ blogs, loading }) => (
  <section className="w-full max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold text-indigo-400 mb-6">Your Blog Posts</h2>
    {loading ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    ) : blogs.length === 0 ? (
      <div className="bg-gray-900 p-8 rounded-xl text-center border border-gray-700 shadow-inner">
        <p className="text-gray-400 text-lg">
          You haven't created any blog posts yet. Start by clicking "Create
          Post" above!
        </p>
      </div>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    )}
  </section>
);

// Reusable Blog Card Component
const BlogCard = ({ blog }) => (
  <Link
    href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
    className="bg-gray-900 hover:border-indigo-500 transition-all duration-300 ease-in-out border border-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl"
  >
    {blog.featuredImage ? (
      <img
        src={blog.featuredImage}
        alt={blog.title}
        className="w-full h-52 object-cover object-center"
      />
    ) : (
      <div className="w-full h-52 bg-gray-800 flex items-center justify-center text-gray-500 text-lg font-semibold">
        No Image Available
      </div>
    )}
    <div className="p-5">
      <h3 className="text-xl font-bold text-indigo-400 mb-2 leading-tight">
        {blog.title}
      </h3>
      <p className="text-sm text-gray-400">
        Published on {dayjs(blog.createdAt).format("MMM D, YYYY")}
      </p>
    </div>
  </Link>
);

// Skeleton Loader for Blog Cards
const BlogCardSkeleton = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-52 bg-gray-800"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);
