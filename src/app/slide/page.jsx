"use client"
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from 'lucide-react'; // Using lucide-react for icons

// Define the slide data based on the PPT content and user's initial slides
const slides = [
  {
    type: "title",
    title: "Enumeration in OOP (C++)",
    subtitle: "Presented by Utsab Adhikari",
    meta: "Roll No.: 241531 | Nepal College of Information Technology, Department of IT Engineering",
    background: "bg-gradient-to-br from-gray-900 to-black" // Darker background
  },
  {
    type: "content",
    title: "Introduction to Enumeration",
    points: [
      "User-defined data type for naming integral constants.",
      "Creates a set of named integer values.",
      "Enhances code readability and maintainability.",
      "Replaces 'magic numbers' with meaningful names."
    ],
    background: "bg-gradient-to-br from-slate-900 to-gray-900" // Darker background
  },
  {
    type: "code-example",
    title: "Enumeration Syntax in C++",
    sections: [
      {
        heading: "Traditional Enum",
        code: `enum Color { RED, GREEN, BLUE };`,
        points: ["Implicitly converts to int.", "Values can clash in the same scope."]
      },
      {
        heading: "Enum Class (Scoped) - C++11",
        code: `enum class TrafficLight { RED, YELLOW, GREEN };`,
        points: ["Requires explicit cast to int.", "Prevents name clashes and improves type safety."]
      }
    ],
    background: "bg-gradient-to-br from-zinc-900 to-slate-900" // Darker background
  },
  {
    type: "code-example",
    title: "Practical Example: Days of the Week",
    code: `#include <iostream>\n\nenum class Day {\n    SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY\n};\n\nvoid printDay(Day day) {\n    switch (day) {\n        case Day::SUNDAY: std::cout << "Sunday" << std::endl; break;\n        case Day::MONDAY: std::cout << "Monday" << std::endl; break;\n        case Day::TUESDAY: std::cout << "Tuesday" << std::endl; break;\n        case Day::WEDNESDAY: std::cout << "Wednesday" << std::endl; break;\n        case Day::THURSDAY: std::cout << "Thursday" << std::endl; break;\n        case Day::FRIDAY: std::cout << "Friday" << std::endl; break;\n        case Day::SATURDAY: std::cout << "Saturday" << std::endl; break;\n        default: std::cout << "Unknown Day" << std::endl; break;\n    }\n}\n\nint main() {\n    Day today = Day::WEDNESDAY;\n    printDay(today); // Output: Wednesday\n    return 0;\n}`,
    background: "bg-gradient-to-br from-neutral-900 to-zinc-900" // Darker background
  },
  {
    type: "features",
    title: "Why We Need Enumeration",
    features: [
      { icon: "📖", name: "Enhanced Readability", description: "Replaces obscure integer constants with self-documenting names." },
      { icon: "📦", name: "Constant Grouping", description: "Logically groups related constants under a single type." },
      { icon: "🛡️", name: "Type Safety", description: "Prevents accidental assignments or comparisons (especially with enum class)." },
      { icon: "🐞", name: "Reduced Errors", description: "Minimizes risk of incorrect or out-of-range integer values." }
    ],
    background: "bg-gradient-to-br from-gray-800 to-neutral-800" // Darker background
  },
  {
    type: "content",
    title: "How Enumeration Works Internally",
    points: [
      "Underlying Type: By default, `int`, but can be specified for `enum class` (e.g., `enum class ByteFlag : unsigned char`).",
      "Value Assignment: First enumerator is 0 by default; subsequent ones increment by 1. Custom values can be assigned (e.g., `enum State { ON = 1, OFF = 0 };`).",
      "Memory Storage: An `enum` variable stores the integer value. Its size depends on its underlying type."
    ],
    background: "bg-gradient-to-br from-slate-800 to-gray-800" // Darker background
  },
  {
    type: "advantages-disadvantages",
    title: "Advantages & Disadvantages",
    advantages: [
      "Improved code clarity.",
      "Implicit conversion (traditional enum).",
      "Stronger type checking (enum class).",
      "Prevents 'magic number' issues.",
      "Easier debugging with descriptive names."
    ],
    disadvantages: [
      "Can increase binary size slightly for large enums.",
      "Adding new enumerators might break switch statements (need default or all cases).",
      "Debugging enum values can show raw integers instead of names in some tools."
    ],
    background: "bg-gradient-to-br from-zinc-800 to-slate-800" // Darker background
  },
  {
    type: "use-cases",
    title: "Real-World Use Cases",
    cases: [
      { name: "Traffic Light System", description: "Representing states like RED, YELLOW, GREEN.", icon: "🚦" },
      { name: "Game Character States", description: "Managing states such as IDLE, RUNNING, JUMPING, ATTACKING.", icon: "🎮" },
      { name: "UI Themes", description: "Defining visual themes like LIGHT_MODE, DARK_MODE, HIGH_CONTRAST.", icon: "🎨" }
    ],
    background: "bg-gradient-to-br from-neutral-800 to-zinc-800" // Darker background
  },
  {
    type: "conclusion",
    title: "Conclusion",
    quote: '"The best code is no code at all." – Kevin Kelly, Wired Magazine',
    points: [
      "Enumerations are a fundamental feature in C++.",
      "Create readable, maintainable, and type-safe code.",
      "Enhance code clarity and reduce errors.",
      "Indispensable in modern OOP development."
    ],
    background: "bg-gradient-to-br from-gray-900 to-black" 
  },
  {
    type: "thank-you",
    title: "Thank You!",
    message: "Thank you for your attention. If you have any questions, feel free to ask!",
    contact: "Utsab Adhikari | Roll No.: 241531",
    background: "bg-gradient-to-br from-gray-900 to-black" // A slightly different dark gradient for the end
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === "ArrowRight") {
        handleNextSlide();
      } else if (event.key === "ArrowLeft") {
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const SlideContent = ({ slide }) => {
    switch (slide.type) {
      case "title":
        return (
          <>
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.h2
              className="text-2xl md:text-3xl mb-2 text-gray-300" // Adjusted text color
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.subtitle}
            </motion.h2>
            <motion.p
              className="text-base md:text-lg mb-4 text-gray-400" // Adjusted text color
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {slide.meta}
            </motion.p>
          </>
        );
      case "content":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            <ul className="text-xl md:text-2xl space-y-4 text-gray-200 text-left max-w-3xl mx-auto list-disc list-inside"> {/* Adjusted text color */}
              {slide.points.map((p, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx + 0.2 }}
                  className="bg-white/5 p-3 rounded-lg shadow-inner backdrop-blur-sm border border-gray-700" // Darker background for list items
                >
                  {p}
                </motion.li>
              ))}
            </ul>
          </>
        );
      case "code-example":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            {slide.sections ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {slide.sections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-gray-800 bg-opacity-70 text-left p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full" // Darker background for code sections
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * idx + 0.2 }}
                  >
                    <h3 className="text-2xl font-semibold mb-4 text-indigo-300">{section.heading}</h3>
                    <pre className="bg-black/60 p-4 rounded-lg text-sm text-green-300 overflow-auto mb-4 flex-grow"> {/* Darker background for pre */}
                      <code>{section.code}</code>
                    </pre>
                    <ul className="text-lg text-gray-300 list-disc list-inside space-y-1"> {/* Adjusted text color */}
                      {section.points.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="bg-gray-800 bg-opacity-70 text-left p-6 rounded-xl shadow-lg border border-gray-700 w-full max-w-4xl" // Darker background for code block
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <pre className="bg-black/60 p-4 rounded-lg text-sm md:text-base text-green-300 overflow-auto max-h-[60vh]"> {/* Darker background for pre */}
                  <code>{slide.code}</code>
                </pre>
              </motion.div>
            )}
          </>
        );
      case "features":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {slide.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/5 p-6 rounded-xl shadow-lg backdrop-blur-sm flex flex-col items-center text-gray-200 text-center border border-gray-700" // Darker background for feature cards
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx + 0.2 }}
                >
                  <span className="text-5xl mb-3">{feature.icon}</span>
                  <h3 className="text-2xl font-semibold mb-2">{feature.name}</h3>
                  <p className="text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        );
      case "advantages-disadvantages":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
              <motion.div
                className="bg-green-800/70 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-green-700" // Darker green
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-3xl font-semibold mb-4 text-white">Advantages ✅</h3>
                <ul className="text-xl text-gray-200 space-y-3 list-disc list-inside"> {/* Adjusted text color */}
                  {slide.advantages.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                className="bg-red-800/70 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-red-700" // Darker red
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl font-semibold mb-4 text-white">Disadvantages ⚠️</h3>
                <ul className="text-xl text-gray-200 space-y-3 list-disc list-inside"> {/* Adjusted text color */}
                  {slide.disadvantages.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </>
        );
      case "use-cases":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {slide.cases.map((_case, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white/5 p-6 rounded-xl shadow-lg backdrop-blur-sm flex flex-col items-center text-gray-200 text-center border border-gray-700" // Darker background for use case cards
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx + 0.2 }}
                >
                  <span className="text-5xl mb-3">{_case.icon}</span>
                  <h3 className="text-2xl font-semibold mb-2">{_case.name}</h3>
                  <p className="text-lg">{_case.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        );
      case "conclusion":
        return (
          <>
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="italic text-2xl md:text-3xl mt-4 mb-8 border-l-4 border-gray-500 pl-6 text-gray-300 max-w-3xl mx-auto" // Adjusted border and text color
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.quote}
            </motion.p>
            <ul className="text-xl md:text-2xl space-y-3 text-gray-200 text-left max-w-2xl mx-auto list-disc list-inside"> {/* Adjusted text color */}
              {slide.points.map((p, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx + 0.4 }}
                  className="bg-white/5 p-3 rounded-lg shadow-inner backdrop-blur-sm border border-gray-700" // Darker background for list items
                >
                  {p}
                </motion.li>
              ))}
            </ul>
          </>
        );
      case "thank-you":
        return (
          <>
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl mb-4 text-gray-300"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.message}
            </motion.p>
            <motion.p
              className="text-xl md:text-2xl text-gray-400 mt-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {slide.contact}
            </motion.p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden font-inter">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className={`h-full w-full flex flex-col justify-center items-center text-center px-6 py-12 ${slides[currentSlide].background} transition-all duration-700 ease-in-out`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <SlideContent slide={slides[currentSlide]} />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
            Slide {currentSlide + 1} / {slides.length}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 right-6 flex space-x-4">
        <button
          onClick={handlePrevSlide}
          className="p-3 bg-white/10 text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-gray-700" // Darker button background
          aria-label="Previous Slide"
        >
          <ChevronRight className="rotate-180" size={24} />
        </button>
        <button
          onClick={handleNextSlide}
          className="p-3 bg-white/10 text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-gray-700" // Darker button background
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
