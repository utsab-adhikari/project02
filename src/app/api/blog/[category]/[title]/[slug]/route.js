import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user = await User.findOne({ email: session.user.email });



    const { category, title, slug } = await params;

    const cat = await Category.findOne({ category });

    const blog = await Blog.findOne({
      catid: cat._id,
      title,
      slug,
    });

    if (!blog) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Blog not found",
      });
    }
    await Blog.findByIdAndUpdate(blog._id, {
      $inc: { views: 1 },
    });

    const hasLiked = blog.likedBy.includes(user._id);


    const author = await User.findOne({ _id: blog.authorId });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Blog fetched successfully",
      blog,
      author,
      liked: hasLiked
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { category, title, slug } = await params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    const cat = await Category.findOne({ category });
    if (!cat) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      catid: cat._id,
      title,
      slug,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    const hasLiked = blog.likedBy.includes(user._id);
    let updatedBlog;

    if (hasLiked) {
      // Unlike
      updatedBlog = await Blog.findByIdAndUpdate(
        blog._id,
        {
          $inc: { likes: -1 },
          $pull: { likedBy: user._id },
        },
        { new: true }
      );
    } else {
      // Like
      updatedBlog = await Blog.findByIdAndUpdate(
        blog._id,
        {
          $inc: { likes: 1 },
          $addToSet: { likedBy: user._id },
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: hasLiked ? "Unliked" : "Liked",
      likes: updatedBlog.likes,
      liked: !hasLiked,
    });
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { success: false, message: "Error toggling like" },
      { status: 500 }
    );
  }
}
