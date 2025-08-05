
import BlogPreview from "./BlogPreview";

const BlogDetailsPage = async ({ params }) => {
  const { category, title, slug } = await params;
  return <BlogPreview category={category} title={title} slug={slug} />;
};

export default BlogDetailsPage;
