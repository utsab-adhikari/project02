import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import Blog from '@/models/blogModel';
import Comment from '@/models/commentModel';
import connectDB from '@/db/ConnectDB';

export async function GET(request, { params }) {
  const { email } = await params;

  try {
    await connectDB();

    const profile = await User.findOne({ email });
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const blogs = await Blog.find({ authorId: profile._id }).sort({ createdAt: -1 });

    const blogCount = blogs.length;
    const viewCount = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const likeCount = blogs.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const blogIds = blogs.map((b) => b._id);

    const recentComments = await Comment.find({
      blogId: { $in: blogIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("blogId", "title slug category");

    const formattedComments = recentComments.map((comment) => ({
      id: comment._id,
      author: comment.author,
      text: comment.text,
      createdAt: comment.createdAt,
      blogTitle: comment.blogId?.title || "Untitled",
      blogSlug: `${comment.blogId?.category}/${comment.blogId?.title}/${comment.blogId?.slug}`,
    }));

    return NextResponse.json({
      profile,
      blogs,
      stats: {
        blogCount,
        viewCount,
        likeCount,
        recentComments: formattedComments,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
