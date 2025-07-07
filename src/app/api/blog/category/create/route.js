import connectDB from "@/db/ConnectDB";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { category } = await request.json();

    if (!category) {
      return NextResponse.json({
        status: 400,
        successs: false,
        message: "Field Required",
      });
    }

    const existingCategory = await Category.findOne({ category: category });

    if (existingCategory) {
      return NextResponse.json({
        status: 400,
        successs: false,
        message: "Category already Exists",
      });
    }

    const newCategory = new Category({
      category,
    });

    await newCategory.save();

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Category Created Successfully",
      newCategory,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      successs: false,
      message: ["Internal Server Error", error.message],
    });
  }
}
