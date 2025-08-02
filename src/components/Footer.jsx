import React from "react";
import { 
  FaFacebookF, 
  FaGithub, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaHeart,
  FaCode
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      icon: <FaFacebookF />,
      href: "https://facebook.com",
      label: "Facebook"
    },
    {
      icon: <FaLinkedinIn />,
      href: "https://linkedin.com",
      label: "LinkedIn"
    },
    {
      icon: <FaGithub />,
      href: "https://github.com/utsab-ad",
      label: "GitHub"
    },
    {
      icon: <FaEnvelope />,
      href: "mailto:utsabadhikari075@gmail.com",
      label: "Email"
    }
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Branding and description */}
          <div className="text-center md:text-left max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
                <FaCode className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-indigo-300 tracking-tight">
                BlogSphere
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              A vibrant platform for sharing insights, tutorials, and stories on technology, 
              education, and more.
            </p>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-center">
            <h3 className="text-gray-300 font-medium mb-4 text-sm uppercase tracking-wider">
              Connect with me
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                  aria-label={link.label}
                >
                  <motion.span 
                    whileHover={{ scale: 1.2 }}
                    className="text-base"
                  >
                    {link.icon}
                  </motion.span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright and attribution */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center">
            &copy; {currentYear} BlogSphere. All rights reserved.
          </p>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Made with</span>
            <motion.span 
              className="text-red-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaHeart />
            </motion.span>
            <span>by</span>
            <a 
              href="https://utsab-ad.vercel.app" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Utsab Adhikari
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;