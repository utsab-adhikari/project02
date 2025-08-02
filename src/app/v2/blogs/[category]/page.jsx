import BlogByCategory from "./BlogByCategory";

const BlogByCatPage = async ({ params }) => {
  const { category } = await params;
  return <BlogByCategory category={category} />;
};

export default BlogByCatPage;
