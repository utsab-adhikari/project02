import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await connectDB();

    const data = await request.json();

    const blog = new Blog({
      author: data.author,
      category: data.category,
      title: data.title,
      slug: data.slug,
      featuredImage: data.featuredImage,
      blogcontent: data.blogcontent,
    });
    
    await blog.save();

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Blog added successgully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
