import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { category, title, slug } = await params;

    const cat = await Category.findOne({category});

    const blog = await Blog.findOne({
      catid: cat._id,
      title,
      slug,
    });

    if (!blog) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Blog not found",
      });
    }

    const author = await User.findOne({_id: blog.authorId});

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog fetched successfully",
      blog,
      author,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
