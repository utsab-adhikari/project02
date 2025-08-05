import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.authorid || !data.title || !data.slug || !data.category) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Missing required fields",
      });
    }

    // Find author
    const author = await User.findById(data.authorid);
    if (!author) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Author not found",
      });
    }

    // Find or create category
    let category = await Category.findOne({ category: data.category });
    if (!category) {
      category = await Category.create({ category: data.category });
    }

    // Create blog
    const blog = await Blog.create({
      author: author.name,
      authorId: data.authorid,
      category: data.category,
      catid: category._id,
      title: data.title,
      slug: data.slug,
      featuredImage: data.featuredImage,
      blogcontent: data.blogcontent,
      publishType: data.publishType || "draft" // Default to draft
    });

    return NextResponse.json({
      success: true,
      status: 201,
      message: `Blog ${data.publishType === 'published' ? 'published' : 'saved as draft'} successfully`,
      blog
    });
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: error.message || "Internal Server Error",
    });
  }
}