import connectDB from "@/db/ConnectDB";
import Post from "@/models/postModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await connectDB();

    const data = await request.json();

    const post = new Post({
      author: data.author,
      title: data.title,
      tag: data.tag,
      featuredImage: data.featuredImage,
      postcontent: data.postcontent,
    });

    await post.save();

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Post added successgully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
