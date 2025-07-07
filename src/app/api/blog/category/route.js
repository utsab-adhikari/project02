import connectDB from "@/db/ConnectDB";
import Blog from "@/models/blogModel";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {

        await connectDB();

        const category = await Category.find({});

        if(!category) {
            return NextResponse.json({
            status: 400,
            successs: false,
            message: "Category Not Found"
        });
        }

        return NextResponse.json({
            status: 200,
            success:true,
            category,
        })
        
    } catch (error) {
        return NextResponse.json({
            status: 500,
            successs: false,
            message: ["Internal Server Error", error.message]
        })
    }
}