import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { category, title, slug } = await params;

    const blog = await Blog.findOne({
      category,
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

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog fetched successfully",
      blog,
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
