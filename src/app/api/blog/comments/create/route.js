import { NextResponse } from "next/server";
import Comment from "@/models/commentModel";
import connectDB from "@/db/ConnectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/userModel";
// import dbConnect from "@/utils/dbConnect";

export async function POST(req) {
  await connectDB();
  const { blogId, text } = await req.json();

  const session = await getServerSession(authOptions);

  const user = session?.user
    ? await User.findOne({ email: session.user.email })
    : null;

  if (!blogId || !text) {
    return NextResponse.json(
      { message: "blogId and text are required" },
      { status: 400 }
    );
  }

  try {
    const comment = await Comment.create({
      blogId,
      text,
      author: user.name,
      authorId: user._id,
      authorImg: user.image,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create comment", error },
      { status: 500 }
    );
  }
}
