"use client";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FaBookOpen, 
  FaSpinner, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaHeart, 
  FaCommentAlt,
  FaArrowUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("newest");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const blogsPerPage = 9;

  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog/getall`, {
          withCredentials: true,
        });

        if (!res?.data?.blogs || res.data.blogs.length === 0) {
          toast.error("No blogs found.");
        } else {
          // Add mock engagement data for demonstration
          const blogsWithEngagement = res.data.blogs.map(blog => ({
            ...blog,
            views: blog.views || Math.floor(Math.random() * 1000) + 100,
            likes: blog.likes || Math.floor(Math.random() * 200) + 20,
            comments: blog.comments || Math.floor(Math.random() * 50) + 5,
          }));
          
          setBlogs(blogsWithEngagement);
          setFilteredBlogs(blogsWithEngagement);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(res.data.blogs.map(blog => blog.category))];
          setCategories(["All", ...uniqueCategories]);
        }
      } catch (err) {
        toast.error("Failed to load blogs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
    
    // Scroll event listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter and sort blogs
  useEffect(() => {
    let result = [...blogs];
    
    if (searchQuery) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      result = result.filter(blog => blog.category === selectedCategory);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch(sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return b.views - a.views;
        case "most-liked":
          return b.likes - a.likes;
        case "most-commented":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });
    
    setFilteredBlogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, sortOption, blogs]);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 font-inter bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg mb-4">
            Explore Our Latest Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover thought-provoking articles, tutorials, and stories on technology, 
            education, and beyond
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-lg mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="most-liked">Most Liked</option>
              </select>
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
              </svg>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsGridView(true)}
                className={`p-3 rounded-xl ${isGridView ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button 
                onClick={() => setIsGridView(false)}
                className={`p-3 rounded-xl ${!isGridView ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing {Math.min(filteredBlogs.length, blogsPerPage)} of {filteredBlogs.length} results
            </p>
            <p className="text-gray-400 text-sm">
              {selectedCategory !== "All" ? `Category: ${selectedCategory}` : "All Categories"}
              {sortOption !== "newest" && ` • Sorted by ${sortOption.replace("-", " ")}`}
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-gray-900/50 rounded-2xl shadow-lg border border-gray-800">
            <FaSpinner className="animate-spin text-indigo-500 text-5xl mb-6" />
            <p className="text-gray-400 text-xl font-medium">Loading amazing content...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <motion.div 
            className="text-center p-12 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-800 flex flex-col items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <FaBookOpen className="text-indigo-400 text-6xl mb-6" />
            <p className="text-red-400 text-2xl font-semibold mb-2">
              No blogs found
            </p>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              We couldn't find any blogs matching your criteria. Try adjusting your search or filters.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : isGridView ? (
          // Grid View
          <motion.div 
            className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {currentBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-all duration-300 hover:shadow-indigo-500/20"
                >
                  {/* Featured Image */}
                  <div className="relative h-56 overflow-hidden">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    {/* Engagement metrics overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white text-xs">
                      <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                        <FaEye className="text-indigo-300" />
                        <span>{formatNumber(blog.views)} views</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                        <FaHeart className="text-red-400" />
                        <span>{formatNumber(blog.likes)} likes</span>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-full shadow">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">
                          {dayjs(blog.createdAt).format('MMM DD, YYYY')}
                        </span>
                        <span className="text-xs bg-gray-800 text-gray-300 font-medium px-2.5 py-1 rounded-full">
                          By {blog.author}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>

                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {blog.description || "No description available."}
                      </p>
                    </div>

                    <Link
                      href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                      className="mt-4 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // List View
          <motion.div 
            className="space-y-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {currentBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  variants={fadeIn}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-indigo-500/10"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 relative">
                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"; }}
                        />
                      ) : (
                        <div className="w-full h-64 md:h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      
                      {/* Engagement metrics for list view */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-white text-xs">
                        <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                          <FaEye className="text-indigo-300" />
                          <span>{formatNumber(blog.views)}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                          <FaHeart className="text-red-400" />
                          <span>{formatNumber(blog.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-900/70 px-2 py-1 rounded-full">
                          <FaCommentAlt className="text-cyan-300" />
                          <span>{formatNumber(blog.comments)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-indigo-600/30 text-indigo-200 font-semibold px-3 py-1.5 rounded-full">
                            {blog.category}
                          </span>
                          <span className="text-xs bg-gray-800 text-gray-300 font-medium px-3 py-1.5 rounded-full">
                            By {blog.author}
                          </span>
                          <span className="text-xs bg-gray-800 text-gray-300 font-medium px-3 py-1.5 rounded-full">
                            {dayjs(blog.createdAt).format('MMM DD, YYYY')}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                          {blog.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {blog.description || "No description available."}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <FaEye className="text-indigo-300" />
                            <span>{formatNumber(blog.views)} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaHeart className="text-red-400" />
                            <span>{formatNumber(blog.likes)} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCommentAlt className="text-cyan-300" />
                            <span>{formatNumber(blog.comments)} comments</span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                        >
                          Read Full Article
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > blogsPerPage && (
          <motion.div 
            className="flex justify-center mt-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === 1 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                &lt;
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === pageNum 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700"
                >
                  {totalPages}
                </button>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentPage === totalPages 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                &gt;
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp className="text-white text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;