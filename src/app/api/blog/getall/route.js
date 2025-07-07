import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    await connectDB();

    const blogs = await Blog.find().sort({ createdAt: -1 }); ;

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Blog Loaded successgully",
      blogs
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
