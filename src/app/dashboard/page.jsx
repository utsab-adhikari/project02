"use client";

import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaSpinner,
  FaEnvelope,
  FaGithubSquare,
  FaBookOpen,
  FaRegEdit,
  FaPlus,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated") {
      const fetchProfile = async () => {
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
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-indigo-400">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-red-500 text-xl">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col gap-10">
      {/* Profile Overview */}
      <div className="bg-gray-800 p-6 rounded-xl border border-indigo-600 max-w-4xl w-full mx-auto shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={
              profile.image ||
              "https://placehold.co/120x120/333333/FFFFFF?text=Profile"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover shadow"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-indigo-300">
              {profile.name}
            </h1>
            <p className="text-gray-400">{profile.email}</p>
            <p className="text-sm text-gray-500 mb-4">
              Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
            </p>
            {profile.bio && (
              <p className="italic text-gray-300 mb-4">“{profile.bio}”</p>
            )}
            <div className="flex flex-wrap gap-3">
              {profile.facebook && (
                <Link
                  href={profile.facebook}
                  target="_blank"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                >
                  <FaSquareFacebook /> Facebook
                </Link>
              )}
              {profile.github && (
                <Link
                  href={profile.github}
                  target="_blank"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded text-white text-sm"
                >
                  <FaGithubSquare /> GitHub
                </Link>
              )}
              {profile.contact && (
                <Link
                  href={`https://wa.me/${profile.contact}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
                >
                  <IoLogoWhatsapp /> WhatsApp
                </Link>
              )}
              <Link
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
              >
                <FaEnvelope /> Email
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <Link
            href={`/profile/${profile.email}`}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center gap-2 text-sm"
          >
            <FaBookOpen /> View Profile
          </Link>
          <Link
            href={`/profile/${profile.email}/update`}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center gap-2 text-sm"
          >
            <FaRegEdit /> Update Profile
          </Link>
        </div>
      </div>

      {/* Actions Card */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/posts/create"
          className="bg-indigo-700 hover:bg-indigo-800 p-5 rounded-xl flex items-center gap-4 transition"
        >
          <FaPlus className="text-white text-xl" />
          <div>
            <h3 className="font-semibold text-lg">Create Post</h3>
            <p className="text-gray-300 text-sm">
              Write and publish a new blog post
            </p>
          </div>
        </Link>

        <Link
          href="/blogs/create"
          className="bg-pink-700 hover:bg-pink-800 p-5 rounded-xl flex items-center gap-4 transition"
        >
          <FaPlus className="text-white text-xl" />
          <div>
            <h3 className="font-semibold text-lg">Create Blog</h3>
            <p className="text-gray-300 text-sm">Add a new blog section</p>
          </div>
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/blogs/category/create"
              className="bg-teal-700 hover:bg-teal-800 p-5 rounded-xl flex items-center gap-4 transition"
            >
              <FaPlus className="text-white text-xl" />
              <div>
                <h3 className="font-semibold text-lg">Create Category</h3>
                <p className="text-gray-300 text-sm">Organize blog topics</p>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Blog Section */}
      <div className="w-full max-w-6xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-indigo-300 mb-4">
          Your Blog Posts
        </h2>
        {blogs.length === 0 ? (
          <p className="text-gray-400">You haven’t written any blogs yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                className="bg-gray-800 hover:border-indigo-500 transition border border-gray-700 rounded-lg shadow-md overflow-hidden"
              >
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-indigo-400 mb-1">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {dayjs(blog.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
