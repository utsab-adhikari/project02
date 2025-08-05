import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { id } = params;
    const data = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the blog first
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    // Authorization check
    if (session.user.id !== blog.authorId.toString()) {
      return NextResponse.json(
        { success: false, message: "Only Author can Edit" },
        { status: 403 }
      );
    }

    // Update blog
    blog.category = data.category;
    blog.catid = data.category._id;
    blog.title = data.title;
    blog.slug = data.slug;
    blog.featuredImage = data.featuredImage;
    blog.blogcontent = data.blogcontent;
    blog.publishType = data.publishType || "draft";

    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Internal Server Error",
      status: 500,
    });
  }
}
