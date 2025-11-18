import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

interface BlogAuthorCardProps {
  author: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    bio?: string | null
  }
}

export function BlogAuthorCard({ author }: BlogAuthorCardProps) {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Link href={`/profil/${author.username || author.id}`}>
            <Avatar className="w-16 h-16 ring-2 ring-background shadow-lg hover:scale-110 transition-transform">
              <AvatarImage src={author.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                {author.name?.[0] || author.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Link
                  href={`/profil/${author.username || author.id}`}
                  className="font-semibold text-lg hover:text-primary transition-colors"
                >
                  {author.name || author.username}
                </Link>
                {author.username && (
                  <p className="text-sm text-muted-foreground">
                    @{author.username}
                  </p>
                )}
              </div>
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Takip Et
              </Button>
            </div>

            {author.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
