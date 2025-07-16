import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await connectDB();
    console.log("hey there");
    const { id } = await params;


    const updated = await Blog.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    });

    return NextResponse.json({
      likes: updated.likes,
    });
  } catch (error) {
    console.error("View update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating view count",
      },
      { status: 500 }
    );
  }
}
