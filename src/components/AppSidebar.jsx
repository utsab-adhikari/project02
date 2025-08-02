"use client";

import {
  Home,
  NotebookPen,
  Newspaper,
  Settings,
  UserRoundPlus,
  LogIn,
  PenSquare,
  LayoutDashboard,
  LogOut,
  Bookmark,
  User,
  PlusCircle,
  Menu,
} from "lucide-react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

const baseMenuItems = [
  { title: "Home", url: "/v2", icon: Home },
  { title: "Blogs", url: "/v2/blogs", icon: Newspaper },
  { title: "Dashboard", url: "/v2/dashboard", icon: LayoutDashboard },
];

const createMenuItems = [
  { title: "Create Blog", url: "/v2/blogs/create", icon: PlusCircle },
  { title: "Create Category", url: "/blogs/category/create", icon: Bookmark },
];

const utilityItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function AppSidebar() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isOpen && !e.target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isOpen]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 20 }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700 md:hidden"
      >
        <Menu className="text-indigo-400" size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 shadow-2xl sidebar-container"
          >
            <SidebarContent isMobile={isMobile} toggleSidebar={toggleSidebar} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:block relative inset-y-0 left-0 z-40 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 shadow-2xl">
          <SidebarContent isMobile={isMobile} toggleSidebar={toggleSidebar} />
        </div>
      )}
    </>
  );

  function SidebarContent({ isMobile, toggleSidebar }) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group" onClick={isMobile ? toggleSidebar : undefined}>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                <NotebookPen className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                BlogSphere
              </span>
            </Link>
            
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <IoMdClose className="text-gray-400 hover:text-white" size={20} />
              </button>
            )}
          </div>
        </div>

        {/* User Profile */}
        {isLoggedIn && session?.user && (
          <div className="p-5 border-b border-gray-800">
            <Link 
              href={`/profile/${encodeURIComponent(session.user.email)}`}
              className="flex items-center gap-3 group"
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <div className="relative">
                <img
                  src={session.user.image || "https://avatar.vercel.sh/username"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-white truncate">{session.user.name}</p>
                <p className="text-sm text-gray-400 truncate">{session.user.email}</p>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          {/* Main Navigation */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">Navigation</h3>
            <div className="space-y-1">
              {baseMenuItems.map((item, index) => (
                <NavItem 
                  key={item.title} 
                  item={item} 
                  index={index}
                  toggleSidebar={isMobile ? toggleSidebar : undefined}
                />
              ))}
            </div>
          </div>

          {/* Create Options */}
          {isLoggedIn && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">Create</h3>
              <div className="space-y-1">
                {createMenuItems.map((item, index) => (
                  <NavItem 
                    key={item.title} 
                    item={item} 
                    index={index}
                    toggleSidebar={isMobile ? toggleSidebar : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Account */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">Account</h3>
            <div className="space-y-1">
              {!isLoggedIn ? (
                <>
                  <NavItem 
                    item={{ title: "Login", url: "/v2/authenticate", icon: LogIn }} 
                    index={0}
                    toggleSidebar={isMobile ? toggleSidebar : undefined}
                  />
                </>
              ) : (
                <>
                  <NavItem 
                    item={{ title: "Profile", url: `/profile/${encodeURIComponent(session.user.email)}`, icon: User }} 
                    index={0}
                    toggleSidebar={isMobile ? toggleSidebar : undefined}
                  />
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isMobile) toggleSidebar();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {/* More */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">More</h3>
            <div className="space-y-1">
              {utilityItems.map((item, index) => (
                <NavItem 
                  key={item.title} 
                  item={item} 
                  index={index}
                  toggleSidebar={isMobile ? toggleSidebar : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800">
          <p className="text-xs text-center text-gray-500">
            © {new Date().getFullYear()} BlogSphere
          </p>
        </div>
      </div>
    );
  }

  function NavItem({ item, index, toggleSidebar }) {
    return (
      <motion.div
        variants={itemVariants}
        transition={{ delay: index * 0.05 }}
      >
        <Link 
          href={item.url}
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-indigo-500/10 transition-colors group"
        >
          <div className="w-6 flex justify-center">
            <item.icon size={18} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <span>{item.title}</span>
        </Link>
      </motion.div>
    );
  }
}