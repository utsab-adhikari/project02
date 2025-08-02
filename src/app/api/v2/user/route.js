import connectDB from "@/db/ConnectDB";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();

    // Get query parameters for pagination and sorting
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sort = searchParams.get('sort') || '-createdAt';
    const search = searchParams.get('search') || '';

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    // Get users with pagination
    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password');

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Users loaded successfully",
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "User ID is required"
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "User not found"
      });
    }

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User deleted successfully",
      deletedUser
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message
    });
  }
}