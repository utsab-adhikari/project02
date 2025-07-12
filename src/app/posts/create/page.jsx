"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PostCreate = () => {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    author: "",
    title: "",
    tag: "",
    postcontent: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.author ||
      !formData.title ||
      !formData.tag ||
      !imageUrl ||
      !formData.postcontent
    ) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "/api/post/create",
        {
          ...formData,
          featuredImage: imageUrl,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Post created successfully!");
      setFormData({
        author: "",
        title: "",
        tag: "",
        postcontent: "",
      });
      setImageUrl("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
      router.push("/posts");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center text-indigo-500">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Create New Post</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            required
          />

          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            required
          />

          <input
            type="text"
            name="tag"
            placeholder="Tag (comma-separated)"
            value={formData.tag}
            onChange={handleChange}
            className="p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            required
          />

          {/* Featured Image Upload */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-gray-300">
              Featured Image
            </label>
            <ImageUploader onUpload={handleImageUpload} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="mt-3 h-40 object-cover rounded-lg border border-gray-600"
              />
            )}
          </div>

          {/* Post Content */}
          <div className="sm:col-span-2">
            <textarea
              name="postcontent"
              rows="6"
              placeholder="Write your post content..."
              value={formData.postcontent}
              onChange={handleChange}
              className="w-full p-4 border border-gray-600 bg-gray-700 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md text-white font-medium transition duration-200 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate;
