"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Login for creating articles");
    } else if (
      status === "authenticated" &&
      session?.user?.isVerified === false
    ) {
      toast.error("Verify you email first");
      router.push("/v1/auth/verification");
    }
  }, [session, status, router]);

  const featuredArticles = [
    {
      id: "the-future-of-ai",
      title: "The Future of AI in Content Creation",
      excerpt:
        "Exploring how artificial intelligence is transforming the writing industry and what it means for creators.",
      category: "Technology",
      readTime: "5 min read",
    },
    {
      id: "sustainable-urban-living",
      title: "Sustainable Living in Urban Environments",
      excerpt:
        "Practical tips for reducing your carbon footprint while living in a metropolitan area.",
      category: "Lifestyle",
      readTime: "4 min read",
    },
    {
      id: "blockchain-applications",
      title: "Blockchain Beyond Cryptocurrency",
      excerpt:
        "Real-world applications of blockchain technology that are changing various industries.",
      category: "Business",
      readTime: "6 min read",
    },
  ];
  return (
    <>
      <div className="pt-6">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Explore the Core of Knowledge
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Dive deep into insightful articles, expert opinions, and
                cutting-edge research across all fields of human knowledge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/articles"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Browse Articles
                </Link>
                {status === "unauthenticated" && (
                  <Link
                    href="/v1/auth/signup"
                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    Join Community
                  </Link>
                )}
                {status === "authenticated" && (
                  <Link
                    href="/v1/articles/create"
                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    Publish an Article
                  </Link>
                )}
                {status === "loading" && (
                  <Link
                    href="#"
                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                  >
                    Loading...
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Articles
            </h2>
            <Link
              href="/articles"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {article.readTime}
                    </span>
                    <Link
                      href={`/articles/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Technology",
              "Science",
              "Business",
              "Health",
              "Culture",
              "Politics",
              "Education",
              "Environment",
            ].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase()}`}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-lg font-medium text-gray-900">
                  {category}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mind Behind the Platform */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocK-V4W5o3dbTHMoqIpxlVfslEjvRBgwroE2MnxtFOdmzMDKIxM=s96-c"
                alt="Utsab - Creator of KnowledgeCore"
                width={200}
                height={200}
                className="rounded-full object-cover shadow-md"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The Mind Behind the Platform
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                This platform was born out of a simple idea: to create a space
                where knowledge is freely shared, thoughtfully written, and
                easily accessible to everyone — no gatekeeping, no noise.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mt-4">
                As a student and lifelong learner, I wanted to build something
                that empowers creators, educators, and curious minds to share
                their thoughts without barriers. Whether you're an expert or an
                enthusiast, your voice matters here.
              </p>
              <p className="text-gray-600 text-sm mt-6 italic">
                — Utsab, Creator & Developer
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Become a Contributor
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8">
              Share your knowledge with our community of readers. Publish your
              insights and reach thousands of engaged learners.
            </p>
            <Link
              href="/write"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Writing
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
