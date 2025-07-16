import connectDB from "@/db/ConnectDB";
import Comment from "@/models/commentModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ message: "Missing blogId" }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ blogId, parentId: null }).sort({ createdAt: -1 });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch comments", error }, { status: 500 });
  }
}
