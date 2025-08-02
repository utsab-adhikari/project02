import connectDB from "@/db/ConnectDB";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { catid } = await params;

    await Category.findByIdAndDelete({_id: catid});

    return NextResponse.json({
      status: 200,
      succes: true,
      message: "Catrgory Deleted"
    })
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      successs: false,
      message: ["Internal Server Error", error.message],
    });
  }
}
