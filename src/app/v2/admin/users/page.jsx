"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiSearch,
  FiUser,
  FiMail,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiEdit,
} from "react-icons/fi";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FaSpinner } from "react-icons/fa";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const fetchUsers = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/v2/user?page=${page}&limit=10&search=${search}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination({
          currentPage: res.data.data.pagination.currentPage,
          totalPages: res.data.data.pagination.totalPages,
          totalUsers: res.data.data.pagination.totalUsers,
          limit: res.data.data.pagination.limit,
        });
      } else {
        toast.error("Failed to load users.");
      }
    } catch (err) {
      toast.error("Failed to load users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/");
    }
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage, searchQuery);
    }
  };

  const handleCardClick = (email) => {
    router.push(`/v2/profile/${email}`);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    router.push(`/admin/users/edit/${id}`);
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();

    if (
      !confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/v2/user?id=${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("User deleted successfully.");
        fetchUsers(pagination.currentPage, searchQuery);
      } else {
        toast.error(res.data.message || "Failed to delete user.");
      }
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today at " + format(date, "h:mm a");
    } else if (diffDays === 1) {
      return "Yesterday at " + format(date, "h:mm a");
    } else if (diffDays < 7) {
      return format(date, "EEE 'at' h:mm a");
    }

    return format(date, "MMM d, yyyy");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-indigo-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-5xl" />
        </motion.div>
        <motion.p
          className="ml-4 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading your dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiUser className="text-indigo-500" />
            <span>User Directory</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {pagination.totalUsers} users found • Page {pagination.currentPage}{" "}
            of {pagination.totalPages}
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-500" />
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleCardClick(user.email)}
                  className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-sm rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={user.image || "/default-avatar.png"}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      />
                      {user.lastLogin && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.name}
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-2">
                        <FiMail className="text-gray-500" size={14} />
                        {user.email}
                      </p>

                      <div className="mt-3 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <FiCalendar size={14} />
                          <span>Joined: {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <FiClock size={14} />
                          <span>Last login: {formatDate(user.lastLogin)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={(e) => handleEdit(e, user._id)}
                      className="flex items-center gap-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-md transition-colors"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, user._id, user.name)}
                      disabled={deletingId === user._id}
                      className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                    >
                      {deletingId === user._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FiTrash2 size={16} />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-gray-200 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="text-gray-500 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first user"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
