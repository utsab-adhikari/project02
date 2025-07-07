import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {

    await connectDB();

    const data = await request.json();

    const category = data.category 

    const cat = await Category.findOne({category});

    const blog = new Blog({
      author: data.author,
      category: data.category,
      catid: cat._id,
      title: data.title,
      slug: data.slug,
      featuredImage: data.featuredImage,
      blogcontent: data.blogcontent,
    });
    
    await blog.save();

    return NextResponse.json({
      success: true,
      status: 201,
      message: "Blog added successgully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: ["Internal Server Error", error.message],
    });
  }
}
