"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
      "Are you sure you want to delete this Category?"
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
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex justify-center items-center text-indigo-500">
        Loading session...
      </div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-12">
      {/* Form Section */}
      <section className="flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/5 border border-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-center text-3xl md:text-4xl font-bold text-indigo-300">
            Add New Blog Category
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1 text-gray-300">
                Category Name
              </label>
              <input
                type="text"
                name="category"
                placeholder="e.g., Technology"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-900 text-white placeholder-gray-400 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="bg-indigo-500/10 p-4 rounded-md border-l-4 border-indigo-500 text-indigo-300 text-sm">
              <p>
                Add categories to organize your blog posts. This helps readers
                find content faster and improves site structure.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white py-3 px-5 rounded font-medium transition`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" /> Adding...
                </>
              ) : (
                <>Add Category</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Categories List */}
      <section className="mt-16 px-4 sm:px-8 md:px-16 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-indigo-300">
          📂 Existing Categories
        </h2>

        {catLoading ? (
          <div className="flex justify-center text-center text-gray-400 animate-pulse">
            <p className="mx-auto text-3xl flex items-center gap-2">
              <AiOutlineLoading3Quarters className="animate-spin" />
              Loading...
            </p>
          </div>
        ) : catArray.length === 0 ? (
          <p className="text-red-400 bg-red-900/10 p-3 rounded-lg border border-red-600">
            No categories available. Try adding one!
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catArray.map((cat) => (
              <div
                key={cat._id}
                className="group p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-indigo-200 group-hover:text-indigo-400 transition-colors">
                    {cat.category}
                  </h3>
                  <span className="text-sm text-gray-400 group-hover:text-indigo-300 transition">
                    #{cat._id.slice(-4)}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  Total: <code className="text-gray-200">02</code>
                </p>

                <div className="mt-4 flex justify-end gap-2">
                  <Link
                    href={`/blogs/${cat.category}`}
                    className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    View
                  </Link>
                  {deleteLoading === cat._id ? (
                    <button
                      disabled
                      className="text-red-500 animate-spin font-bold"
                    >
                      <AiOutlineLoading3Quarters size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-sm px-3 py-1 rounded-md bg-red-700 text-white hover:bg-red-800 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryCreate;
