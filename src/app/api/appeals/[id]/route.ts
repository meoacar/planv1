import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// GET /api/appeals/[id] - Get single appeal
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appeal = await db.contentAppeal.findUnique({
      where: { id: params.id },
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
    });

    if (!appeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    // Only owner or admin can view
    if (
      appeal.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(appeal);
  } catch (error) {
    console.error("Error fetching appeal:", error);
    return NextResponse.json(
      { error: "Failed to fetch appeal" },
      { status: 500 }
    );
  }
}

// PATCH /api/appeals/[id] - Resolve appeal (admin only)
const resolveAppealSchema = z.object({
  status: z.enum(["approved", "rejected", "under_review"]),
  adminNote: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validation = resolveAppealSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { status, adminNote } = validation.data;

    const appeal = await db.contentAppeal.findUnique({
      where: { id: params.id },
    });

    if (!appeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    if (appeal.status !== "pending" && appeal.status !== "under_review") {
      return NextResponse.json(
        { error: "Appeal already resolved" },
        { status: 400 }
      );
    }

    // Update appeal
    const updatedAppeal = await db.contentAppeal.update({
      where: { id: params.id },
      data: {
        status,
        adminNote,
        resolvedBy: status !== "under_review" ? session.user.id : undefined,
        resolvedAt: status !== "under_review" ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // If approved, restore the content
    if (status === "approved") {
      switch (appeal.contentType) {
        case "plan":
          await db.plan.update({
            where: { id: appeal.contentId },
            data: { status: "published", publishedAt: new Date() },
          });
          break;
        case "recipe":
          await db.recipe.update({
            where: { id: appeal.contentId },
            data: { status: "published", publishedAt: new Date() },
          });
          break;
        case "comment":
          await db.comment.update({
            where: { id: appeal.contentId },
            data: { status: "visible" },
          });
          break;
        case "recipe_comment":
          await db.recipeComment.update({
            where: { id: appeal.contentId },
            data: { status: "visible" },
          });
          break;
        case "group_post":
          await db.groupPost.update({
            where: { id: appeal.contentId },
            data: { status: "visible" },
          });
          break;
      }

      // Create notification for user
      await db.notification.create({
        data: {
          userId: appeal.userId,
          type: "plan_approved",
          title: "İtirazınız Onaylandı",
          body: `${appeal.contentType} içeriğinize yaptığınız itiraz onaylandı ve içeriğiniz yayınlandı.`,
          targetType: "plan",
          targetId: appeal.contentId,
        },
      });

      // Increase user reputation
      await db.user.update({
        where: { id: appeal.userId },
        data: {
          reputationScore: { increment: 5 },
        },
      });
    } else if (status === "rejected") {
      // Create notification for rejection
      await db.notification.create({
        data: {
          userId: appeal.userId,
          type: "plan_rejected",
          title: "İtirazınız Reddedildi",
          body: `${appeal.contentType} içeriğinize yaptığınız itiraz reddedildi.${adminNote ? ` Sebep: ${adminNote}` : ""}`,
          targetType: "plan",
          targetId: appeal.contentId,
        },
      });
    }
    // under_review durumunda bildirim gönderme

    return NextResponse.json(updatedAppeal);
  } catch (error) {
    console.error("Error resolving appeal:", error);
    return NextResponse.json(
      { error: "Failed to resolve appeal" },
      { status: 500 }
    );
  }
}

// DELETE /api/appeals/[id] - Cancel appeal (user only, if pending)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appeal = await db.contentAppeal.findUnique({
      where: { id: params.id },
    });

    if (!appeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    if (appeal.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (appeal.status !== "pending") {
      return NextResponse.json(
        { error: "Can only cancel pending appeals" },
        { status: 400 }
      );
    }

    await db.contentAppeal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Appeal cancelled" });
  } catch (error) {
    console.error("Error deleting appeal:", error);
    return NextResponse.json(
      { error: "Failed to delete appeal" },
      { status: 500 }
    );
  }
}
