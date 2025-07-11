'use client';

import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaSpinner, FaBookOpen } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { email } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-400">
        <FaSpinner className="animate-spin text-3xl" />
        <span className="ml-3">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-red-400 font-semibold">
        Profile not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10 text-white">
      <div className="bg-[#1e293b] border border-indigo-500/20 rounded-2xl p-6 sm:p-10 shadow-lg w-full max-w-xl text-center">
        <img
          src={profile.image}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-500 mb-4"
        />
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{profile.name}</h2>
        <p className="text-sm text-gray-300 mb-1">{profile.email}</p>
        <p className="text-xs text-gray-500 mb-4">
          Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
        </p>

        {profile.bio && (
          <p className="text-base text-slate-300 mb-4 italic">“{profile.bio}”</p>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <a
            href={`/blogs?author=${profile.email}`}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white flex items-center gap-2"
          >
            <FaBookOpen />
            View Blogs
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="px-4 py-2 border border-gray-500 rounded-full text-gray-300 hover:text-white hover:border-white"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
