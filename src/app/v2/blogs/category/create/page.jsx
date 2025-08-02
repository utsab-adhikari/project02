"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CategoryCreate = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [catArray, setCatArray] = useState([]);

  useEffect(() => {
    setCatLoading(true);
    const getCategories = async () => {
      try {
        const res = await axios.get(`/api/blog/category`, {
          withCredentials: true,
        });
        setCatArray(res?.data?.category || []);
        if (!res?.data?.category || res.data.category.length === 0) {
          toast.error("No categories found.");
        }
      } catch (err) {
        toast.error("Failed to load categories.");
        console.error(err);
      } finally {
        setCatLoading(false);
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return toast.error("Category cannot be empty");
    const toastId = toast.loading("Creating category...");
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/blog/category/create`,
        { category },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Category created!", { id: toastId });
      if (res.data.newCategory) {
        setCatArray((prev) => [...prev, res.data.newCategory]);
      }
      setCategory("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (catid) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this Category? All related blogs will be removed!"
    );
    if (!confirm) return;
    setDeleteLoading(catid);
    const toastId = toast.loading("Deleting category...");
    try {
      const res = await axios.delete(`/api/blog/category/${catid}`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Category Deleted!", { id: toastId });
      setCatArray((prev) => prev.filter((item) => item._id !== catid));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-indigo-500" />
        </motion.div>
      </div>
    );
  }
  
  if (session && session.user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-center p-6">
        <div className="bg-red-900/30 backdrop-blur-sm p-8 rounded-2xl border border-red-800 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6">
            Only administrators can manage categories. Please contact your site administrator for access.
          </p>
          <Link 
            href="/" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    visible: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white px-4 py-12">
      {/* Floating particles */}
      <div className="fixed top-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse"></div>
      <div className="fixed top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse"></div>
      <div className="fixed bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse"></div>
      
      {/* Form Section */}
      <motion.section 
        className="flex items-center justify-center mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Create New Category
            </h1>
            <p className="text-gray-400">
              Organize your content with meaningful categories
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Category Name
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Technology, Design, Business"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-gray-800/50 text-white placeholder-gray-500 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="bg-indigo-900/20 p-4 rounded-xl border-l-4 border-indigo-500 text-indigo-300 text-sm">
              <p>
                Categories help organize your content and improve discoverability. 
                Choose descriptive names that reflect the content themes.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 p-4 rounded-xl font-medium transition-all ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> Creating...
                </>
              ) : (
                "Add Category"
              )}
            </button>
          </form>
        </div>
      </motion.section>

      {/* Categories List */}
      <motion.section 
        className="max-w-7xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Existing Categories
          </h2>
          <p className="text-gray-400 text-sm">
            {catArray.length} categor{catArray.length === 1 ? "y" : "ies"} found
          </p>
        </div>

        {catLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <AiOutlineLoading3Quarters className="text-indigo-500 text-4xl" />
            </motion.div>
            <p className="text-gray-400 mt-4">Loading categories...</p>
          </div>
        ) : catArray.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/20 mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-6">Create your first category to get started</p>
          </div>
        ) : (
          <motion.div 
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {catArray.map((cat) => (
                <motion.div
                  key={cat._id}
                  variants={fadeIn}
                  className="group p-6 rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-gray-950 backdrop-blur-sm shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
                  whileHover={{ y: -10 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-300 group-hover:text-indigo-400 transition-colors truncate">
                      {cat.category}
                    </h3>
                    <span className="text-xs text-gray-500 group-hover:text-indigo-300 transition">
                      #{cat._id.slice(-4)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Link
                      href={`/v2/blogs/${cat.category}`}
                      className="text-sm px-4 py-2 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 hover:text-white transition-colors"
                    >
                      View Blogs
                    </Link>
                    
                    {deleteLoading === cat._id ? (
                      <button
                        disabled
                        className="text-red-400 p-2"
                      >
                        <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-sm px-4 py-2 rounded-lg bg-red-700/30 text-red-400 hover:bg-red-700/50 hover:text-white transition-colors"
                        title="Delete category"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default CategoryCreate;