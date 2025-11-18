import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { BlogForm } from '@/components/admin/blog-form'

export const metadata = {
  title: 'Blog Yazısını Düzenle | Admin',
  description: 'Blog yazısını düzenle',
}

async function getBlogPost(id: string) {
  const post = await db.blogPost.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      blog_tags: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  return post
}

async function getFormData() {
  const [categories, tags] = await Promise.all([
    db.blogCategory.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    db.blogTag.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ])

  return { categories, tags }
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  const [post, { categories, tags }] = await Promise.all([
    getBlogPost(id),
    getFormData(),
  ])

  const initialData = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || '',
    coverImage: post.coverImage || '',
    coverImageAlt: post.coverImageAlt || '',
    metaTitle: post.metaTitle || '',
    metaDescription: post.metaDescription || '',
    categoryId: post.categoryId,
    tags: post.blog_tags.map((tag) => tag.id),
    status: post.status as 'DRAFT' | 'PUBLISHED',
    featured: post.featured,
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogForm
        initialData={initialData}
        categories={categories}
        tags={tags}
        isEdit
        postId={id}
      />
    </div>
  )
}
