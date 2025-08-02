import BlogDetails from "./BlogDetails";

const BlogDetailsPage = async ({ params }) => {
  const { category, title, slug } = await params;
  return <BlogDetails category={category} title={title} slug={slug} />;
};

export default BlogDetailsPage;
