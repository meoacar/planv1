import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";

const createGroupSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    "general",
    "motivation",
    "recipes",
    "exercise",
    "support",
    "age_based",
    "goal_based",
    "lifestyle",
  ]),
  isPublic: z.boolean().default(true),
  maxMembers: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  rules: z.string().max(1000).optional(),
});

// GET /api/v1/groups - List groups
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [groups, total] = await Promise.all([
      db.group.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.group.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: groups,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Gruplar yüklenemedi" } },
      { status: 500 }
    );
  }
}

// POST /api/v1/groups - Create group
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = createGroupSchema.parse(body);

    // Generate unique slug
    let slug = slugify(validated.name, { lower: true, strict: true });
    const existingSlug = await db.group.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const group = await db.group.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        category: validated.category,
        isPublic: validated.isPublic,
        maxMembers: validated.maxMembers,
        tags: validated.tags ? JSON.stringify(validated.tags) : null,
        rules: validated.rules,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "creator",
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: error.errors } },
        { status: 400 }
      );
    }
    console.error("Error creating group:", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: "Grup oluşturulamadı" } },
      { status: 500 }
    );
  }
}
