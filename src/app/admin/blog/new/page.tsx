import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { BlogForm } from '@/components/admin/blog-form'

export const metadata = {
  title: 'Yeni Blog Yazısı | Admin',
  description: 'Yeni blog yazısı oluştur',
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

export default async function NewBlogPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/giris')
  }

  const { categories, tags } = await getFormData()

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogForm categories={categories} tags={tags} />
    </div>
  )
}
