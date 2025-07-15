import React from "react";
import { FaArrowRight, FaCommentDots, FaEnvelope, FaUser } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-gray-800 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-12 drop-shadow-lg">
        Get In Touch
      </h2>
      <form className="max-w-2xl mx-auto grid gap-6 p-8 bg-[#1e1f21] rounded-xl shadow-2xl border border-gray-700">
        <div className="relative">
          <input
            type="text"
            id="name"
            placeholder=" "
            className="peer p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all duration-300"
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-400"
          >
            Your Name
          </label>
          <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder=" "
            className="peer p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all duration-300"
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-400"
          >
            Your Email
          </label>
          <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <textarea
            id="message"
            placeholder=" "
            rows={6}
            className="peer p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all duration-300 resize-y"
          />
          <label
            htmlFor="message"
            className="absolute left-4 top-4 text-gray-400 text-base transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-indigo-400"
          >
            Your Message
          </label>
          <FaCommentDots className="absolute right-4 top-4 text-gray-500" />
        </div>

        <button
          type="submit"
          className="mt-4 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Send Message <FaArrowRight className="ml-2" />
        </button>
      </form>
    </section>
  );
};

export default Contact;
