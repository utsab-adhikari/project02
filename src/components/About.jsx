import React from 'react'
import { FaCode, FaGraduationCap, FaLightbulb } from 'react-icons/fa'

const About = () => {
  return (
         <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-indigo-400 mb-8 drop-shadow-lg">
          About DevBlogs
        </h2>
        <p className="max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed mb-8">
          DevBlogs is more than just a platform; it's a vibrant community where
          innovation meets inspiration. We empower developers, students, and
          enthusiasts to share their unique perspectives, groundbreaking
          projects, and valuable insights. Whether you're diving deep into web
          development, exploring the frontiers of AI, mastering engineering
          principles, or simply sharing compelling stories, DevBlogs provides
          the perfect space for you to publish, connect, and grow. Join us in
          shaping the future of knowledge sharing!
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <div className="flex flex-col items-center">
            <FaCode className="text-indigo-400 text-5xl mb-3" />
            <p className="text-gray-300 font-semibold">Technical Expertise</p>
          </div>
          <div className="flex flex-col items-center">
            <FaGraduationCap className="text-indigo-400 text-5xl mb-3" />
            <p className="text-gray-300 font-semibold">Educational Insights</p>
          </div>
          <div className="flex flex-col items-center">
            <FaLightbulb className="text-indigo-400 text-5xl mb-3" />
            <p className="text-gray-300 font-semibold">Creative Storytelling</p>
          </div>
        </div>
      </section>
  )
}

export default About