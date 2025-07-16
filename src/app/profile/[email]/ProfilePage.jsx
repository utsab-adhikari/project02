"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import {
  FaSpinner,
  FaBookOpen,
  FaEnvelope,
  FaShareAlt,
  FaRegEdit, // Added for share button
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { IoLogoWhatsapp } from 'react-icons/io5';
import {FaSquareFacebook, FaSquareGithub } from 'react-icons/fa6'; // Using fa6 for consistency
import { useSession } from 'next-auth/react';

// Main Profile Page Component
export default function App() {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true); // Specific loading state for profile
  const [loadingBlogs, setLoadingBlogs] = useState(true); // Specific loading state for blogs
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!email) return;

    const getProfileAndBlogs = async () => {
      setLoadingProfile(true);
      setLoadingBlogs(true); // Set blog loading true when fetching profile
      try {
        const res = await axios.get(`/api/profile/${email}`, {
          withCredentials: true,
        });
        if (!res?.data?.profile) {
          toast.error('Profile not found.');
          setProfile(null);
          setBlogs([]);
        } else {
          setProfile(res.data.profile);
          setBlogs(res.data.blogs || []);
        }
      } catch (err) {
        toast.error('Failed to load profile.');
        console.error('Profile data fetch error:', err);
        setProfile(null);
        setBlogs([]);
      } finally {
        setLoadingProfile(false);
        setLoadingBlogs(false);
      }
    };

    getProfileAndBlogs();
  }, [email]);

  // Show full-screen loading for initial profile data
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400">
        <FaSpinner className="animate-spin text-5xl mr-4" />
        <span className="text-xl font-medium">Loading profile...</span>
      </div>
    );
  }

  // Show error if profile is not found after loading
  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-red-500 text-2xl font-semibold">
        Profile not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter p-6 lg:p-10 flex flex-col items-center">
      {/* Profile Card Section */}
      <ProfileCard profile={profile} />

      {/* Blogs Section */}
      <UserBlogsSection blogs={blogs} loading={loadingBlogs} profileName={profile.name} />
    </div>
  );
}

// Component for Profile Card
const ProfileCard = ({ profile }) => {
  // Access session for conditional rendering of "Update Profile" button
  const { data: session } = useSession();

  const handleShareProfile = async () => {
    const profileUrl = window.location.href; // Get the current URL of the profile page

    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: `${profile.name}'s Profile`,
          text: `Check out ${profile.name}'s profile and blogs!`,
          url: profileUrl,
        });
        toast.success('Profile shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share profile.');
      }
    } else {
      // Fallback for browsers that don't support Web Share API (copy to clipboard)
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link. Please copy manually.');
      }
    }
  };

  return (
    <section className="bg-gray-900 border border-indigo-700/30 rounded-3xl p-6 sm:p-10 shadow-2xl w-full max-w-3xl text-center mx-auto transform transition-all duration-300 hover:scale-[1.005] hover:shadow-indigo-500/20 mb-10">
      <div className="relative mb-6">
        <img
          src={
            profile.image ||
            'https://placehold.co/150x150/222222/EEEEEE?text=Profile'
          }
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-indigo-600 shadow-xl transform transition-transform duration-300 hover:scale-105"
        />
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-300 mb-2 leading-tight">
        {profile.name}
      </h2>
      <p className="text-lg text-gray-400 mb-1">{profile.email}</p>
      <p className="text-sm text-gray-500 mb-6">
        Joined on {dayjs(profile.createdAt).format('MMMM D, YYYY')}
      </p>

      {profile.bio && (
        <p className="text-lg text-slate-300 mb-8 italic leading-relaxed">
          “{profile.bio}”
        </p>
      )}

      {/* Social Links */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {profile.facebook && (
          <Link
            href={profile.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-blue-700 hover:bg-blue-800 transition-all duration-300 text-white rounded-lg text-base font-medium shadow-md hover:shadow-lg"
          >
            <FaSquareFacebook size={22} /> Facebook
          </Link>
        )}
        {profile.github && (
          <Link
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-gray-700 hover:bg-gray-800 transition-all duration-300 text-white rounded-lg text-base font-medium shadow-md hover:shadow-lg"
          >
            <FaSquareGithub size={22} /> GitHub
          </Link>
        )}
        {profile.contact && (
          <Link
            href={`https://wa.me/${profile.contact}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white rounded-lg text-base font-medium shadow-md hover:shadow-lg"
          >
            <IoLogoWhatsapp size={22} /> WhatsApp
          </Link>
        )}
        {profile.email && (
          <Link
            href={`mailto:${profile.email}`}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 transition-all duration-300 text-white rounded-lg text-base font-medium shadow-md hover:shadow-lg"
          >
            <FaEnvelope size={20} /> Email
          </Link>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {session?.user?.email === profile.email && ( // Check if the current user is viewing their own profile
          <Link
            href={`/profile/${profile.email}/update`}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex items-center gap-2 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
          >
            <FaRegEdit size={20} />
            Update Profile
          </Link>
        )}
        <button
          onClick={handleShareProfile}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white flex items-center gap-2 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-purple-500/40 transform hover:-translate-y-0.5"
        >
          <FaShareAlt size={20} />
          Share Profile
        </button>
      </div>
    </section>
  );
};

// Component for User Blogs Section
const UserBlogsSection = ({ blogs, loading, profileName }) => (
  <section className="w-full max-w-6xl mx-auto mt-12">
    <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center sm:text-left">
      Blogs by {profileName}
    </h2>

    {loading ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    ) : blogs.length === 0 ? (
      <div className="bg-gray-900 p-8 rounded-xl text-center border border-gray-700 shadow-inner">
        <p className="text-gray-400 text-lg">
          No blogs found from {profileName} yet.
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

// Reusable Blog Card Component (reused from dashboard)
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
        Published on {dayjs(blog.createdAt).format('MMM D, YYYY')}
      </p>
    </div>
  </Link>
);

// Skeleton Loader for Blog Cards (reused from dashboard)
const BlogCardSkeleton = () => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-52 bg-gray-800"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);
