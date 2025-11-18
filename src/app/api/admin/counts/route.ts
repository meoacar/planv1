import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let pendingAppeals = 0;
    try {
      pendingAppeals = await db.contentAppeal.count({ where: { status: "pending" } });
    } catch (error) {
      // Table might not exist yet
      pendingAppeals = 0;
    }

    let pendingGuilds = 0;
    try {
      pendingGuilds = await db.guild.count({ where: { status: "pending" } });
    } catch (error) {
      pendingGuilds = 0;
    }

    let draftBlogs = 0;
    try {
      draftBlogs = await db.blogPost.count({ 
        where: { 
          status: "DRAFT",
          deletedAt: null 
        } 
      });
    } catch (error) {
      draftBlogs = 0;
    }

    const [
      pendingPlans,
      pendingRecipes,
      pendingComments,
      underReviewPlans,
    ] = await Promise.all([
      db.plan.count({ where: { status: "pending" } }),
      db.recipe.count({ where: { status: "pending" } }),
      db.comment.count({ where: { status: "pending" } }),
      db.plan.count({ where: { status: "under_review" } }),
    ]);

    return NextResponse.json({
      plans: pendingPlans,
      recipes: pendingRecipes,
      comments: pendingComments,
      appeals: pendingAppeals,
      guilds: pendingGuilds,
      underReview: underReviewPlans,
      blogs: draftBlogs,
    });
  } catch (error) {
    console.error("Error fetching admin counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}
