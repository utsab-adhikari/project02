import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connectDB();

  try {
    const { blogId } =  await request.json();

    await Blog.findByIdAndUpdate( blogId, { publishType: "published"});
    return NextResponse.json({
        success: true,
        status: 201,
        message: "Blog Published",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
