import connectDB from "@/db/ConnectDB";
import Comment from "@/models/commentModel";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ message: "Missing postId" }, { status: 400 });
  }

  try {
    const comments = await Comment.find({ postId, parentId: null }).populate("replies");

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch comments", error }, { status: 500 });
  }
}
