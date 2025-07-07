import { NextResponse } from "next/server";
import Comment from "@/models/commentModel";
import connectDB from "@/db/ConnectDB";
// import dbConnect from "@/utils/dbConnect";

export async function POST(req) {
  await connectDB();
  const { postId, text } = await req.json();

  if (!postId || !text) {
    return NextResponse.json({ message: "postId and text are required" }, { status: 400 });
  }

  try {
    const comment = await Comment.create({ postId, text });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create comment", error }, { status: 500 });
  }
}