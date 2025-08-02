"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  FaArrowRight,
  FaCode,
  FaSpinner,
  FaEye,
  FaHeart,
  FaGoogle,
  FaEnvelope,
  FaUser,
  FaPhone,
  FaGlobe,
  FaComments,
  FaPenFancy,
  FaLayerGroup
} from "react-icons/fa";
import { motion } from "framer-motion";

// Landing Page Component
const LandingPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { status } = useSession();

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await axios.get(`/api/blog/getall`, {
          withCredentials: true,
        });
        setBlogs(res.data.blogs.slice(0, 3));
      } catch (err) {
        toast.error("Failed to load latest blogs.");
      } finally {
        setLoadingBlogs(false);
      }
    };

    const getCategories = async () => {
      try {
        const res = await axios.get(`/api/blog/category`, {
          withCredentials: true,
        });
        setCategories(res.data.category);
      } catch (err) {
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    getBlogs();
    getCategories();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      setLoggedIn(true);
    } else if (status === "unauthenticated") {
      setLoggedIn(false);
    }
  }, [status]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please enter your feedback.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        "/api/feedback",
        { feedback },
        { withCredentials: true }
      );
      toast.success("Feedback submitted successfully!");
      setFeedback("");
    } catch (err) {
      toast.error("Failed to submit feedback.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/80 to-gray-950"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-sm font-medium border border-indigo-800">
              Where Ideas Flourish
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-6 tracking-tight leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Share Your <span className="text-white">Thoughts</span>, <br className="hidden sm:block" />Inspire the <span className="text-white">World</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            A vibrant platform for sharing insights, tutorials, and stories on technology, education, and more.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/v2/blogs"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 group"
            >
              Explore Content <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            {loggedIn && (
              <Link
                href="/v2/blogs/create"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-indigo-500 text-indigo-300 hover:bg-indigo-500 hover:text-white font-semibold rounded-full shadow-lg transition-all duration-300 group"
              >
                Create Post <FaCode className="ml-2 group-hover:rotate-6 transition-transform" />
              </Link>
            )}
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute bottom-20 left-10 w-4 h-4 rounded-full bg-purple-500 blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-6 h-6 rounded-full bg-indigo-500 blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-3 h-3 rounded-full bg-cyan-400 blur-xl animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Blogging Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to share your knowledge and connect with readers</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all"
              variants={fadeIn}
            >
              <div className="w-14 h-14 rounded-full bg-indigo-900/30 flex items-center justify-center mb-5">
                <FaPenFancy className="text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rich Editor</h3>
              <p className="text-gray-400">Create beautiful posts with our markdown-enabled editor and media support</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all"
              variants={fadeIn}
            >
              <div className="w-14 h-14 rounded-full bg-purple-900/30 flex items-center justify-center mb-5">
                <FaLayerGroup className="text-purple-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Organized Categories</h3>
              <p className="text-gray-400">Categorize your content for better discoverability and reader engagement</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-all"
              variants={fadeIn}
            >
              <div className="w-14 h-14 rounded-full bg-cyan-900/30 flex items-center justify-center mb-5">
                <FaComments className="text-cyan-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Engage Readers</h3>
              <p className="text-gray-400">Real-time stats, comments, and reactions to connect with your audience</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Latest Insights</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Discover fresh perspectives from our community</p>
          </motion.div>
          
          {loadingBlogs ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-lg">
              <FaSpinner className="animate-spin text-indigo-500 text-5xl mb-4" />
              <p className="text-gray-400 text-xl">Loading latest posts...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center p-12 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-lg">
              <p className="text-gray-400 text-xl">No recent posts to display</p>
              <Link
                href="/v2/blogs"
                className="inline-flex items-center mt-4 px-6 py-2 text-indigo-300 border border-indigo-500 rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300"
              >
                Explore Content <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {blogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  variants={fadeIn}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link
                    href={`/v2/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                    className="block h-full bg-gradient-to-b from-gray-900/50 to-gray-950 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={blog.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white text-sm">
                        <span className="flex items-center gap-2 bg-gray-900/70 px-2 py-1 rounded">
                          <FaEye size={14} /> {blog.views || 0}
                        </span>
                        <span className="flex items-center gap-2 bg-gray-900/70 px-2 py-1 rounded">
                          <FaHeart size={14} /> {blog.likes || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-1 text-xs bg-indigo-900/30 text-indigo-300 rounded">
                          {blog.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {blog.slug || "No description available."}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                          <FaUser size={10} />
                        </div>
                        <span>{blog.author}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <Link
              href="/v2/blogs"
              className="inline-flex items-center px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 group"
            >
              View All Posts <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Explore Categories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Dive into topics that interest you most</p>
          </motion.div>
          
          {loadingCategories ? (
            <div className="flex flex-col items-center justify-center h-40">
              <FaSpinner className="animate-spin text-indigo-500 text-4xl mb-4" />
              <p className="text-gray-400 text-lg">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-lg">
              <p className="text-gray-400 text-lg">No categories available yet.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat._id}
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href={`/v2/blogs/${cat.category}`}
                    className="block p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl text-center hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                      <FaLayerGroup className="text-indigo-400" />
                    </div>
                    <span className="font-medium text-gray-200">{cat.category}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {status === "unauthenticated" && (
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-gray-800"
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Join Our Community</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Sign in with Google to create your own blogs, engage with content, and join a vibrant community of creators and readers.
              </p>
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center px-8 py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full shadow-lg transition-all duration-300 group"
              >
                <FaGoogle className="text-red-500 mr-2" /> Sign in with Google
              </button>
              <p className="text-gray-500 mt-4 text-sm">
                No credit card required. Start sharing in seconds.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* About the Developer Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">About the Developer</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">The mind behind this platform</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl overflow-hidden"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/dnh6hzxuh/image/upload/v1752651455/jtuwbpzdg1xrf4fv2oru.jpg" 
                      alt="Utsab Adhikari" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Utsab Adhikari</h3>
                <p className="text-indigo-300 mb-4">Full Stack Developer & Tech Enthusiast</p>
                <p className="text-gray-400 mb-6">
                  Passionate about creating meaningful digital experiences. This platform was built to empower creators and foster a community of knowledge sharing.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <a
                    href="mailto:utsabadhikari075@gmail.com"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <FaEnvelope /> utsabadhikari075@gmail.com
                  </a>
                  <a
                    href="https://utsab-ad.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <FaGlobe /> utsab-ad.vercel.app
                  </a>
                  <a
                    href="tel:+9779867508725"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <FaPhone /> +977 9867508725
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact/Feedback Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-950 to-black">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">We'd Love to Hear From You</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Your feedback helps us improve</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl"
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div>
                <label htmlFor="feedback" className="block mb-2 font-medium text-gray-300">
                  Share your thoughts
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 placeholder-gray-500"
                  placeholder="What do you like about the platform? What can we improve?"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex justify-center items-center gap-2 py-4 rounded-xl text-white font-semibold transition-all duration-300 ${
                  submitting
                    ? "bg-indigo-600/50 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }`}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <FaEnvelope /> Submit Feedback
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;