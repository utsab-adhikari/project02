"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FaSpinner,
  FaEnvelope,
  FaGithubSquare,
  FaBookOpen,
  FaRegEdit,
  FaPlus,
  FaSignOutAlt,
  FaRobot,
  FaCommentDots,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import { FaSquareFacebook } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io5";
import toast from "react-hot-toast";
import Link from "next/link";
import { CiMenuKebab } from "react-icons/ci";
import { ContextMenu } from "@/v2Components/ContextMenu";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    blogCount: 0,
    viewCount: 0,
    likeCount: 0,
    recentComments: [],
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "admin" || false;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }

    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/api/dashboard/${session.user.email}`);
          const { profile, blogs, stats } = res.data;

          if (!profile) {
            toast.error("Profile not found.");
            setLoading(false);
            return;
          }

          setProfile(profile);
          setBlogs(blogs);
          setStats(stats);
        } catch (err) {
          toast.error("Failed to fetch dashboard data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-indigo-400">
        <FaSpinner className="animate-spin text-5xl mr-4" />
        <span className="text-xl font-medium">Loading dashboard...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-red-500 text-2xl font-semibold">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <div className="relative w-full h-40 bg-blue-600">
          <p className="mx-auto text-center text-sm font-semibold text-green-400">
            {" "}
            Welcome ! to Dashboard (v2)
          </p>
          <button
            onClick={() => signOut()}
            className="absolute bg-red-600/30 p-2 hover:bg-red-600/50 cursor-pointer flex items-center rounded-full top-2 right-2 font-semibold transition-all duration-300 shadow-md"
          >
            <FaSignOutAlt />
          </button>
          <div className="">
            <p className="text-xl right-3 font-semibold absolute bottom-0 ">
              {profile.name}
            </p>
            <img
              src={
                profile.image ||
                "https://placehold.co/150x150/222222/EEEEEE?text=Profile"
              }
              alt={`${profile.name}'s avatar`}
              className="absolute mx-[10vw] h-20 w-20 rounded-full border-2 border-white bottom-[-40] "
            />
          </div>
        </div>
      </div>
      <div className="pt-10">
        <p className="text-indigo-200 font-semibold text-sm mx-auto text-center">
          Overview
        </p>
        <AnalyticsSection stats={stats} />
      </div>
      <div className="px-5 py-2 flex justify-evenly items-center">
        <Link
          href="#"
          className="bg-green-500 px-2 py-2 font-semibold hover:bg-green-400 rounded text-black text-sm"
        >
          Create Blog
        </Link>
        <Link
          href="#"
          className="bg-stone-600 px-2 py-2 rounded text-stone-200 font-semibold hover:bg-stone-500 text-sm"
        >
          AI Assistant
        </Link>
        {/* <Link href="#" className="bg-blue-300 px-2 py-2 rounded text-black text-sm" >Upgrade</Link> */}
      </div>
      <div className="">
        {blogs.length === 0 ? (
          <div className="">
            <p className="text-gray-400 text-lg">
              You haven't created any blog posts yet. Click "Create Post" above
              to start!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 px-4 py-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="relative flex bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Three-dot context menu */}
                <div className="absolute top-0 right-3 z-10">
                  <ContextMenu blogId={blog._id} />
                </div>

                <Link
                  href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
                  className="flex flex-row"
                >
                  {/* ✅ Image always on left */}
                  <div className="flex-1 w-[120px] sm:w-[160px] md:w-[200px] h-auto shrink-0">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* ✅ Text on the right */}
                  <div className="p-4 flex flex-col justify-between max-w-[60vw]">
                    <div>
                      <h3 className="text-indigo-300 text-lg font-semibold truncate">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Published on{" "}
                        {dayjs(blog.createdAt).format("MMM D, YYYY")}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <p className="flex items-center text-sm gap-1 text-gray-300">
                        {blog.views} <FaEye />
                      </p>
                      <p className="flex items-center text-sm gap-1 text-gray-300">
                        {blog.likes} <FaHeart />
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const AnalyticsSection = ({ stats }) => {
  const cards = [
    { title: "Total Blogs", value: stats.blogCount, icon: <FaBookOpen /> },
    { title: "Total Views", value: stats.viewCount, icon: <FaEye /> },
    { title: "Total Likes", value: stats.likeCount, icon: <FaHeart /> },
    {
      title: "Recent Comments",
      value: stats.recentComments.length,
      icon: <FaCommentDots />,
    },
  ];

  return (
    <section className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 max-w-7xl mx-auto">
      {cards.map((c) => (
        <div
          key={c.title}
          className="flex items-center bg-gray-800 p-4 rounded-lg"
        >
          <div className="text-indigo-400 text-3xl mr-4">{c.icon}</div>
          <div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-gray-400">{c.title}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

function ProfileSection({ profile }) {
  return (
    <section className="bg-gray-900 p-8 rounded-2xl border border-indigo-700 max-w-7xl mx-auto shadow-2xl mb-10 transform hover:scale-[1.005] transition-transform duration-300">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative">
          <img
            src={
              profile.image ||
              "https://placehold.co/150x150/222222/EEEEEE?text=Profile"
            }
            alt={`${profile.name}'s avatar`}
            className="w-36 h-36 rounded-full object-cover border-4 border-indigo-600 shadow-xl"
          />
          <span className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-gray-900" />
        </div>

        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-indigo-300 mb-1">
            {profile.name}
          </h2>
          <p className="text-lg text-gray-400 mb-2">{profile.email}</p>
          <p className="text-sm text-gray-500 mb-4">
            Joined on {dayjs(profile.createdAt).format("MMMM D, YYYY")}
          </p>

          {profile.bio && (
            <p className="mt-4 italic text-gray-300 text-lg leading-relaxed">
              “{profile.bio}”
            </p>
          )}

          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            {/* Socials */}
            {profile.facebook && (
              <SocialButton
                url={profile.facebook}
                icon={<FaSquareFacebook />}
                text="Facebook"
                className="bg-blue-700 hover:bg-blue-800"
              />
            )}
            {profile.github && (
              <SocialButton
                url={profile.github}
                icon={<FaGithubSquare />}
                text="GitHub"
                className="bg-gray-700 hover:bg-gray-800"
              />
            )}
            {profile.contact && (
              <SocialButton
                url={`https://wa.me/${profile.contact}`}
                icon={<IoLogoWhatsapp />}
                text="WhatsApp"
                className="bg-green-700 hover:bg-green-800"
              />
            )}
            <SocialButton
              url={`mailto:${profile.email}`}
              icon={<FaEnvelope />}
              text="Email"
              className="bg-red-700 hover:bg-red-800"
            />
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
            <Link
              href={`/profile/${profile.email}`}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center gap-2 font-semibold transition-all shadow-lg transform hover:-translate-y-0.5"
            >
              <FaBookOpen /> View Profile
            </Link>
            <Link
              href={`/profile/${profile.email}/update`}
              className="px-7 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center gap-2 font-semibold transition-all shadow-lg transform hover:-translate-y-0.5"
            >
              <FaRegEdit /> Update Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialButton({ url, icon, text, className }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 ${className} px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md`}
    >
      {icon} {text}
    </Link>
  );
}

function ActionCards({ isAdmin }) {
  return (
    <section className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
      <Card
        href="/posts/create"
        color="indigo"
        icon={<FaPlus />}
        title="Create Post"
        description="Write a new blog post"
      />
      <Card
        href="/blogs/create"
        color="pink"
        icon={<FaPlus />}
        title="Create Blog"
        description="Add a new blog category"
      />
      {isAdmin && (
        <Card
          href="/blogs/category/create"
          color="teal"
          icon={<FaPlus />}
          title="Create Category"
          description="Organize content with new categories"
        />
      )}
      <Card
        href="/ai-tools"
        color="indigo"
        icon={<FaRobot />}
        title="AI Assistant"
        description="Generate posts, get suggestions, chat with AI"
      />
    </section>
  );
}

function Card({ href, color, icon, title, description }) {
  const base = `bg-${color}-700 hover:bg-${color}-800`;
  return (
    <Link
      href={href}
      className={`${base} p-6 rounded-xl flex items-center gap-5 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
    >
      <div className="p-3 rounded-full bg-white bg-opacity-10 text-2xl">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-xl mb-1">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function RecentCommentsSection({ comments }) {
  return (
    <section className="bg-gray-900 p-6 rounded-xl border border-indigo-700 max-w-7xl mx-auto mb-10">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">
        Recent Comments
      </h2>
      {comments.length > 0 ? (
        comments.map((c) => (
          <div key={c.id} className="py-3 border-b border-gray-800">
            <p className="text-sm text-gray-300">
              <span className="text-indigo-200 font-semibold">{c.author}</span>{" "}
              on{" "}
              <Link
                href={`/blogs/${c.blogSlug}`}
                className="text-indigo-300 hover:underline"
              >
                {c.blogTitle}
              </Link>
              :
            </p>
            <p className="text-gray-400">
              “{c.text.length > 80 ? c.text.slice(0, 80) + "…" : c.text}”
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recent comments.</p>
      )}
    </section>
  );
}

function BlogList({ blogs }) {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6">
        Your Blog Posts
      </h2>
      {blogs.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-xl text-center border border-gray-700 shadow-inner">
          <p className="text-gray-400 text-lg">
            You haven't created any blog posts yet. Click "Create Post" above to
            start!
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.category}/${blog.title}/${blog.slug}`}
              className="bg-gray-900 hover:border-indigo-500 border border-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition"
            >
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-52 object-cover"
                />
              ) : (
                <div className="w-full h-52 bg-gray-800 flex items-center justify-center text-gray-500 text-lg font-semibold">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h3 className="text-xl font-bold text-indigo-400 mb-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-400">
                  Published on {dayjs(blog.createdAt).format("MMM D, YYYY")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
