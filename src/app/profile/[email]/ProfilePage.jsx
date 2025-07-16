"use client";

import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSpinner, FaBookOpen, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaGithubSquare } from "react-icons/fa";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    if (!email) return;

    const getProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/profile/${email}`, {
          withCredentials: true,
        });
        if (!res?.data?.profile) {
          toast.error("Profile not found.");
        } else {
          setProfile(res.data.profile);
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [email]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-indigo-400">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="ml-4 text-xl">Loading session...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-indigo-400">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="ml-4 text-xl">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-center py-10 text-red-500 font-semibold text-xl">
        Profile not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-gray-900 text-white font-inter">

      <div className="bg-gray-800 border border-indigo-600/30 rounded-3xl p-6 sm:p-10 shadow-2xl w-full max-w-2xl text-center mx-auto transform transition-all duration-300 hover:scale-[1.01] hover:shadow-indigo-500/20">
        <img
          src={profile.image || "https://placehold.co/120x120/333333/FFFFFF?text=Profile"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-indigo-500 shadow-lg mb-6 transform transition-transform duration-300 hover:scale-105"
        />

        <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-300 mb-2">
          {profile.name}
        </h2>
        <p className="text-md text-gray-400 mb-1">{profile.email}</p>
        <p className="text-sm text-gray-500 mb-6">
          Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
        </p>

        {profile.bio && (
          <p className="text-lg text-slate-300 mb-8 italic leading-relaxed">
            “{profile.bio}”
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {/* Social Links */}
          {(profile.facebook ||
            profile.github ||
            profile.contact ||
            profile.email) && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-3 justify-center">
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
                    <FaGithubSquare size={22} /> GitHub
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
            </div>
          )}

          {session && profile._id === session.user.id && (
            <Link
              href={`/profile/${profile.email}/update`}
              className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex items-center gap-2 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-indigo-500/40"
            >
              <FaRegEdit size={20} />
              Update Profile
            </Link>
          )}
        </div>
      </div>

      {/* Blogs Section */}
      <div className="w-full bg-gray-800 text-white p-6 rounded-3xl shadow-2xl mt-12 border border-gray-700  transform transition-all duration-300 hover:scale-[1.005] hover:shadow-indigo-500/20">
        <h2 className="text-3xl font-bold text-indigo-300 mb-8 border-b-2 border-indigo-600 pb-4">
          Blogs by {profile.name}
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <FaSpinner className="animate-spin text-indigo-500 text-4xl mr-4" />
            <p className="text-gray-300 text-xl">Loading blogs...</p>
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-gray-400 text-center py-10 text-lg">
            <p>No blogs found from this user.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-indigo-500 transform hover:-translate-y-1"
              >
                {/* Blog Image */}
                {blog.featuredImage ? (
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/600x300/222222/999999?text=Image+Unavailable";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-400 text-base font-medium">
                    No Image Available
                  </div>
                )}

                {/* Blog Info */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-indigo-400 mb-3 hover:underline leading-tight">
                    <FaBookOpen className="inline-block mr-2 text-indigo-300" />
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Category:{" "}
                    <span className="font-medium text-indigo-300">
                      {blog.category}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Published: {dayjs(blog.createdAt).format("MMMM D, YYYY")}
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
