"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSpinner, FaSave } from "react-icons/fa";
import ImageUploader from "@/components/ImageUploader";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfileUpdatePage() {
  const { data: session, status } = useSession();
  const { email } = useParams();
  const decodedEmail = email.replace("%40", "@");
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [github, setGithub] = useState("");
  const [contact, setContact] = useState("");
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email !== decodedEmail) {
      toast.error("Unauthorized access.");
      router.replace("/");
    }
  }, [status, session, decodedEmail, router]);

  useEffect(() => {
    if (!email) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/v2/profile/${email}`, {
          withCredentials: true,
        });

        if (!res?.data?.profile) {
          toast.error("Profile not found.");
        } else {
          setProfile(res.data.profile);
          setBio(res.data.profile.bio || "");
          setContact(res.data.profile.contact || "");
          setImageUrl(res.data.profile.image || "");
          setFacebook(res.data.profile.facebook || "");
          setGithub(res.data.profile.github || "");
          setName(res.data.profile.name || "");
        }
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [email]);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    toast.success("Image uploaded successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Name is required.");
      return;
    }
    if (!bio && !contact && !facebook && !github && !imageUrl) {
      toast.error("Please fill in at least one field to update.");
      return;
    }

    setUpdating(true);
    try {
      await axios.put(
        `/api/profile/${email}`,
        {
          bio,
          contact,
          image: imageUrl,
          name,
          facebook,
          github,
        },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
      router.push(`/v2/profile/${email}`);
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-indigo-400">
        <FaSpinner className="animate-spin text-5xl mr-4" />
        <span className="text-xl font-medium">Loading...</span>
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

      <main className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-indigo-400 mb-8 text-center tracking-tight">
          Update Your Profile
        </h2>
        <div className="bg-gray-900 rounded-2xl p-8 border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/10 transition-shadow duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <label className="block mb-2 font-medium text-gray-300 text-lg">
                Profile Image
              </label>
              <ImageUploader onUpload={handleImageUpload} />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover mt-4 border-4 border-indigo-500 shadow-md"
                />
              )}
            </div>

            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-300">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block mb-2 font-medium text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label htmlFor="contact" className="block mb-2 font-medium text-gray-300">
                Contact (Phone, WhatsApp, etc.)
              </label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="e.g. +9779867500000"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block mb-2 font-medium text-gray-300">
                Facebook
              </label>
              <input
                type="url"
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="e.g. https://facebook.com/username"
              />
            </div>

            <div>
              <label htmlFor="github" className="block mb-2 font-medium text-gray-300">
                GitHub
              </label>
              <input
                type="url"
                id="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                placeholder="e.g. https://github.com/username"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                updating
                  ? "bg-indigo-600/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {updating ? (
                <>
                  <FaSpinner className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave size={20} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}