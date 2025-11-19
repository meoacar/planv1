import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/v1/groups/[slug] - Get group details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const session = await auth();
    const group = await db.group.findUnique({
      where: { slug: params.slug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        members: {
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
          orderBy: { joinedAt: "asc" },
          take: 20,
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Grup bulunamadı" } },
        { status: 404 }
      );
    }

    // Check if user is member
    let isMember = false;
    let memberRole = null;
    if (session?.user?.id) {
      const membership = await db.groupMember.findUnique({
        where: {
          groupId_userId: {
            groupId: group.id,
            userId: session.user.id,
          },
        },
      });
      isMember = !!membership;
      memberRole = membership?.role;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...group,
        isMember,
        memberRole,
      },
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Grup yüklenemedi" } },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/groups/[slug] - Delete group (creator only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const group = await db.group.findUnique({
      where: { slug: params.slug },
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Grup bulunamadı" } },
        { status: 404 }
      );
    }

    if (group.creatorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok" } },
        { status: 403 }
      );
    }

    await db.group.delete({
      where: { id: group.id },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Grup silindi" },
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message: "Grup silinemedi" } },
      { status: 500 }
    );
  }
}
