"use client";

import ImageUploader from "@/components/ImageUploader";
import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const CreateBlog = () => {
  const { data: session, status } = useSession();

  const editor = useRef(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    authorid: "",
    featuredImage: "",
    blogcontent: "",
  });

  const [catArray, setCatArray] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (value) => {
    setFormData((prev) => ({ ...prev, blogcontent: value }));
  };
  
  useEffect(() => {
     if (status === "unauthenticated") {
      router.push("/login");
    };
    if (session?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        authorid: session.user.id,
      }));
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!imageUrl) {
      toast.error("Please upload a featured image");
      return setSubmitting(false);
    }

    try {
      const res = await axios.post(`/api/blog/create`, {
        ...formData,
        featuredImage: imageUrl,
      });

      toast.success(res.data.message || "Blog created successfully!");
      setFormData({
        title: "",
        slug: "",
        category: "",
        featuredImage: "",
        blogcontent: "",
      });
      setImageUrl("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
      router.push("/blogs");
    }
  };

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get(`/api/blog/category`, {
          withCredentials: true,
        });
        setCatArray(res?.data?.category || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories.");
      }
    };
    getCategories();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center text-indigo-500">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center font-bold text-indigo-400 mb-10 text-3xl sm:text-4xl">
          Create New Blog
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md"
            required
          />

          <input
            type="text"
            name="slug"
            placeholder="Slug (e.g., my-awesome-post)"
            value={formData.slug}
            onChange={handleChange}
            className="p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md"
            required
          />

          {/* Category Select */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-gray-300">
              Select Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md"
              required
            >
              <option value="">-- Choose a Category --</option>
              {catArray.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
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

          {/* Jodit Rich Text Editor */}
          <div className="sm:col-span-2">
            <label className="block mb-2 font-medium text-gray-300">
              Blog Content
            </label>
            <div className="bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
              <JoditEditor
                ref={editor}
                value={formData.blogcontent}
                onChange={handleEditorChange}
                config={{
                  theme: "dark",
                  readonly: false,
                  height: 400,
                }}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="sm:col-span-2 bg-white/5 border border-white/10 p-5 rounded-md">
            <h3 className="font-semibold text-indigo-300 mb-2">
              Why this blog stands out?
            </h3>
            <p className="text-sm text-gray-300">
              Highlight originality, depth of knowledge, and value. Be
              professional, insightful, and useful to your audience.
            </p>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-md text-white font-medium transition duration-200 ${
                submitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {submitting ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
