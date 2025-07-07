import connectDB from "@/db/ConnectDB";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    await connectDB();

    const posts = await Post.find().sort({ createdAt: -1 }); ;

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Post Loaded successgully",
      posts
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
