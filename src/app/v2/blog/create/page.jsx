"use client";

import ImageUploader from "@/components/ImageUploader";
import axios from "axios";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { FiSave } from "react-icons/fi";

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

  // Debounce function to limit state updates
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced editor change handler
  const handleEditorChange = useCallback(
    debounce((value) => {
      setFormData((prev) => ({ ...prev, blogcontent: value }));
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
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
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`/api/v2/blog/create`, {
        ...formData,
        featuredImage: imageUrl,
        publishType: "published",
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
      router.push("/blogs");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDraft = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!imageUrl) {
      toast.error("Please upload a featured image");
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(`/api/v2/blog/create`, {
        ...formData,
        featuredImage: imageUrl,
        publishType: "draft",
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
      router.push("/blogs");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
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
      <div className="min-h-screen flex justify-center items-center text-blue-400 bg-slate-950">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 px-4 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center font-bold text-blue-400 mb-8 text-2xl sm:text-3xl md:text-4xl">
          Create New Blog
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Blog Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-100"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              placeholder="e.g., my-awesome-post"
              value={formData.slug}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-100"
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              required
            >
              <option value="" disabled>
                -- Choose a Category --
              </option>
              {catArray.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Featured Image
            </label>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <ImageUploader onUpload={handleImageUpload} />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="mt-4 w-full max-w-md h-48 object-cover rounded-lg border border-slate-700"
                />
              )}
            </div>
          </div>

          {/* Jodit Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Blog Content
            </label>
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editor}
                value={formData.blogcontent}
                onChange={handleEditorChange}
                config={{
                  theme: "dark",
                  readonly: false,
                  height: 500,
                  minHeight: 300,
                  toolbarSticky: true,
                  toolbarAdaptive: false,
                  buttons: [
                    "bold",
                    "italic",
                    "underline",
                    "|",
                    "ul",
                    "ol",
                    "|",
                    "link",
                    "image",
                    "|",
                    "undo",
                    "redo",
                  ],
                  placeholder: "Write your blog content here...",
                  style: {
                    background: "#1e293b",
                    color: "#e5e7eb",
                    border: "none",
                  },
                  editorCssClass: "jodit-dark",
                  autofocus: false,
                  askBeforePasteHTML: false,
                  askBeforePasteFromWord: false,
                  disablePlugins: [
                    "speechRecognize",
                    "video",
                    "file",
                    "preview",
                    "print",
                    "about",
                    "table",
                    "formatBlock",
                    "dragAndDrop",
                    "paste",
                  ],
                  events: {
                    afterInit: (editor) => {
                      editor.selection.focus();
                    },
                    keydown: (event) => {
                      // Prevent cursor jumping
                      if (event.target.classList.contains("jodit")) {
                        event.stopPropagation();
                      }
                    },
                  },
                  debounceTimeout: 500,
                  limitChars: 0,
                  limitWords: 0,
                  saveHeightInStorage: false,
                  spellcheck: true,
                  enter: "P",
                  defaultActionOnPaste: "insert",
                }}
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
            <h3 className="font-semibold text-blue-300 mb-2">
              Why this blog stands out?
            </h3>
            <p className="text-sm text-gray-300">
              Highlight originality, depth of knowledge, and value. Be
              professional, insightful, and useful to your audience.
            </p>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg text-white font-medium transition duration-200 flex items-center justify-center gap-2 ${
                submitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              <FiSave />
              {submitting ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
        <div>
          <button
            type="submit"
            onClick={handleDraft}
            disabled={submitting}
            className={`w-full py-3 rounded-lg mt-5 text-white font-medium transition duration-200 flex items-center justify-center gap-2 ${
              submitting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            <FiSave />
            {submitting ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
