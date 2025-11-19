import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim()

    // Search in parallel
    const [plans, recipes, blogs, users, groups] = await Promise.all([
      // Plans
      prisma.plan.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
        },
      }),

      // Recipes
      prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          description: true,
        },
      }),

      // Blog posts
      prisma.blogPost.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { excerpt: { contains: searchTerm } },
          ],
          status: 'PUBLISHED',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
        },
      }),

      // Users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { username: { contains: searchTerm } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          username: true,
        },
      }),

      // Groups
      prisma.group.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
        },
      }),
    ])

    const results = [
      ...plans.map((plan) => ({
        id: plan.id,
        title: plan.title,
        description: plan.description || undefined,
        type: 'plan' as const,
        url: `/planlar/${plan.id}`,
      })),
      ...recipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || undefined,
        type: 'recipe' as const,
        url: `/tarifler/${recipe.id}`,
      })),
      ...blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        description: blog.excerpt || undefined,
        type: 'blog' as const,
        url: `/blog/${blog.slug}`,
      })),
      ...users.map((user) => ({
        id: user.id,
        title: user.name || user.username || 'Kullanıcı',
        description: `@${user.username}`,
        type: 'user' as const,
        url: `/profil/${user.username}`,
      })),
      ...groups.map((group) => ({
        id: group.id,
        title: group.name,
        description: group.description || undefined,
        type: 'group' as const,
        url: `/gruplar/${group.id}`,
      })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
