import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { category } = await params;

    const cat = await Category.findOne({ category });

    const blogs = await Blog.find({ catid: cat._id });

    const noofblog = blogs.length;

    return NextResponse.json({
      status: 200,
      succes: true,
      message: "Catrgory Deleted",
      blogs,
      noofblog,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      successs: false,
      message: ["Internal Server Error", error.message],
    });
  }
}
