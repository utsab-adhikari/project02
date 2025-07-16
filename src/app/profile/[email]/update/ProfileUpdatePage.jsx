"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaSpinner, FaSave } from "react-icons/fa";
import ImageUploader from "@/components/ImageUploader";
import { useSession } from "next-auth/react";

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
  const [thief, setThief] = useState("");
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.email !== decodedEmail) {
        toast.error("Unauthorized access.");
        setThief(":::::");
        router.replace("/");
      }
    }
  }, [status, session, decodedEmail, router]);

  useEffect(() => {
    if (!email) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/profile/${email}`, {
          withCredentials: true,
        });

        if (!res?.data?.profile) {
          toast.error("Profile not found.");
        } else {
          setProfile(res.data.profile);
          setBio(res.data.profile.bio || "");
          setContact(res.data.profile.contact || "");
          setImageUrl(res.data.profile.image);
          setFacebook(res.data.profile.facebook || "");
          setGithub(res.data.profile.github || "");
          setName(res.data.profile.name);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio && !contact) {
      toast.error("Please fill in at least one field.");
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
          name: name,
          facebook: facebook,
          github: github,
        },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully.");
      router.push(`/profile/${email}`);
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-indigo-400">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="ml-4 text-xl">Loading session...</span>
      </div>
    );
  }

  if (thief === ":::::") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-indigo-400">
        <FaSpinner className="animate-spin text-4xl" />
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
    <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-900 text-white">
      <div className="bg-[#1e293b] border border-indigo-500/30 p-8 rounded-2xl w-full max-w-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center  justify-center sm:col-span-2 mx-auto">
            <label className="block mb-2 font-medium text-gray-300">
              Image
            </label>
            <ImageUploader onUpload={handleImageUpload} />
            {imageUrl && (
              <img
                src={imageUrl || res.data.profile.image}
                alt="Uploaded"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-indigo-500 mb-4"
              />
            )}
          </div>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. +9779867500000"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write something about yourself..."
            />
          </div>
          <div>
            <label htmlFor="contact" className="block mb-1 font-medium">
              Contact (Phone, WhatsApp, etc.)
            </label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. +9779867500000"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block mb-1 font-medium">
              Facebook
            </label>
            <input
              type="url"
              id="facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. https://facebook.com"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block mb-1 font-medium">
              Github
            </label>
            <input
              type="url"
              id="facebook"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. https://github.com/username"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className={`w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-medium transition ${
              updating ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {updating ? (
              <>
                <FaSpinner className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
