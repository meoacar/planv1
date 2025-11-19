import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/v1/groups/[slug]/join - Join group
export async function POST(
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
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Grup bulunamadı" } },
        { status: 404 }
      );
    }

    // Check if already member
    const existingMember = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: session.user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_MEMBER", message: "Zaten üyesiniz" } },
        { status: 400 }
      );
    }

    // Check max members
    if (group.maxMembers && group._count.members >= group.maxMembers) {
      return NextResponse.json(
        { success: false, error: { code: "GROUP_FULL", message: "Grup dolu" } },
        { status: 400 }
      );
    }

    // Add member
    await db.$transaction([
      db.groupMember.create({
        data: {
          groupId: group.id,
          userId: session.user.id,
          role: "member",
        },
      }),
      db.group.update({
        where: { id: group.id },
        data: { memberCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { message: "Gruba katıldınız" },
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { success: false, error: { code: "JOIN_ERROR", message: "Gruba katılınamadı" } },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/groups/[slug]/join - Leave group
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

    // Can't leave if creator
    if (group.creatorId === session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Grup kurucusu ayrılamaz" } },
        { status: 403 }
      );
    }

    const member = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: session.user.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_MEMBER", message: "Üye değilsiniz" } },
        { status: 400 }
      );
    }

    await db.$transaction([
      db.groupMember.delete({
        where: { id: member.id },
      }),
      db.group.update({
        where: { id: group.id },
        data: { memberCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { message: "Gruptan ayrıldınız" },
    });
  } catch (error) {
    console.error("Error leaving group:", error);
    return NextResponse.json(
      { success: false, error: { code: "LEAVE_ERROR", message: "Gruptan ayrılınamadı" } },
      { status: 500 }
    );
  }
}
