import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { notifyAdmins } from "@/lib/notifications";

// GET /api/appeals - List user's appeals or all appeals (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const contentType = searchParams.get("contentType");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const isAdmin = session.user.role === "ADMIN";

    const where: any = isAdmin ? {} : { userId: session.user.id };

    if (status) {
      where.status = status;
    }
    if (contentType) {
      where.contentType = contentType;
    }

    const [appeals, total] = await Promise.all([
      db.contentAppeal.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              reputationScore: true,
            },
          },
          resolver: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.contentAppeal.count({ where }),
    ]);

    // Fetch content details for each appeal
    const appealsWithContent = await Promise.all(
      appeals.map(async (appeal) => {
        let contentDetails = null;

        try {
          switch (appeal.contentType) {
            case "plan":
              const plan = await db.plan.findUnique({
                where: { id: appeal.contentId },
                select: { title: true, description: true, slug: true },
              });
              contentDetails = plan ? { title: plan.title, description: plan.description, slug: plan.slug } : null;
              break;
            case "recipe":
              const recipe = await db.recipe.findUnique({
                where: { id: appeal.contentId },
                select: { title: true, description: true, slug: true },
              });
              contentDetails = recipe ? { title: recipe.title, description: recipe.description, slug: recipe.slug } : null;
              break;
            case "comment":
              const comment = await db.comment.findUnique({
                where: { id: appeal.contentId },
                select: { content: true },
              });
              contentDetails = comment ? { content: comment.content } : null;
              break;
            case "recipe_comment":
              const recipeComment = await db.recipeComment.findUnique({
                where: { id: appeal.contentId },
                select: { content: true },
              });
              contentDetails = recipeComment ? { content: recipeComment.content } : null;
              break;
            case "group_post":
              const groupPost = await db.groupPost.findUnique({
                where: { id: appeal.contentId },
                select: { content: true },
              });
              contentDetails = groupPost ? { content: groupPost.content } : null;
              break;
          }
        } catch (error) {
          console.error(`Error fetching content for appeal ${appeal.id}:`, error);
        }

        return {
          ...appeal,
          contentDetails,
        };
      })
    );

    return NextResponse.json({
      appeals: appealsWithContent,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching appeals:", error);
    return NextResponse.json(
      { error: "Failed to fetch appeals" },
      { status: 500 }
    );
  }
}

// POST /api/appeals - Create new appeal
const createAppealSchema = z.object({
  contentType: z.enum(["plan", "recipe", "comment", "recipe_comment", "group_post"]),
  contentId: z.string(),
  reason: z.string().min(20, "Reason must be at least 20 characters").max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = createAppealSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { contentType, contentId, reason } = validation.data;

    // Check if content exists and is rejected
    let content: any = null;
    let isRejected = false;

    switch (contentType) {
      case "plan":
        content = await db.plan.findUnique({
          where: { id: contentId },
          select: { status: true, authorId: true },
        });
        isRejected = content?.status === "rejected";
        break;
      case "recipe":
        content = await db.recipe.findUnique({
          where: { id: contentId },
          select: { status: true, authorId: true },
        });
        isRejected = content?.status === "rejected";
        break;
      case "comment":
        content = await db.comment.findUnique({
          where: { id: contentId },
          select: { status: true, authorId: true },
        });
        isRejected = content?.status === "hidden";
        break;
      case "recipe_comment":
        content = await db.recipeComment.findUnique({
          where: { id: contentId },
          select: { status: true, authorId: true },
        });
        isRejected = content?.status === "hidden";
        break;
      case "group_post":
        content = await db.groupPost.findUnique({
          where: { id: contentId },
          select: { status: true, authorId: true },
        });
        isRejected = content?.status === "hidden";
        break;
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    if (!isRejected) {
      return NextResponse.json(
        { error: "Can only appeal rejected/hidden content" },
        { status: 400 }
      );
    }

    if (content.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only appeal your own content" },
        { status: 403 }
      );
    }

    // Check if already appealed
    const existingAppeal = await db.contentAppeal.findFirst({
      where: {
        userId: session.user.id,
        contentType,
        contentId,
        status: { in: ["pending", "under_review"] },
      },
    });

    if (existingAppeal) {
      return NextResponse.json(
        { error: "You already have a pending appeal for this content" },
        { status: 400 }
      );
    }

    // Get user reputation for priority calculation
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { reputationScore: true },
    });

    // Calculate priority based on reputation (0-100 scale)
    const priority = Math.min(100, Math.max(0, user?.reputationScore || 0));

    const appeal = await db.contentAppeal.create({
      data: {
        userId: session.user.id,
        contentType,
        contentId,
        reason,
        priority,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            reputationScore: true,
          },
        },
      },
    });

    // Admin'lere bildirim gönder
    const contentTypeNames: Record<string, string> = {
      plan: 'Plan',
      recipe: 'Tarif',
      comment: 'Yorum',
      recipe_comment: 'Tarif Yorumu',
      group_post: 'Grup Gönderisi'
    }

    await notifyAdmins({
      type: 'appeal_pending',
      title: 'Yeni İtiraz Bekliyor',
      message: `${appeal.user.name || appeal.user.username} tarafından ${contentTypeNames[contentType]} için itiraz yapıldı`,
      link: `/admin/itirazlar`,
      metadata: {
        appealId: appeal.id,
        contentType,
        contentId,
        userId: session.user.id,
      }
    })

    return NextResponse.json(appeal, { status: 201 });
  } catch (error) {
    console.error("Error creating appeal:", error);
    return NextResponse.json(
      { error: "Failed to create appeal" },
      { status: 500 }
    );
  }
}
