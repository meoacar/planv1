'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface BlogComment {
  id: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM'
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    email: string | null
  }
  post: {
    id: string
    title: string
    slug: string
  }
}

interface CommentModerationProps {
  comments: BlogComment[]
  onStatusChange: (commentId: string, status: 'APPROVED' | 'REJECTED' | 'SPAM') => void
}

export function CommentModeration({ comments, onStatusChange }: CommentModerationProps) {
  const [selectedComment, setSelectedComment] = useState<BlogComment | null>(null)
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | 'SPAM' | null>(null)

  const handleAction = (comment: BlogComment, action: 'APPROVED' | 'REJECTED' | 'SPAM') => {
    setSelectedComment(comment)
    setActionType(action)
  }

  const confirmAction = () => {
    if (selectedComment && actionType) {
      onStatusChange(selectedComment.id, actionType)
      setSelectedComment(null)
      setActionType(null)
    }
  }

  const cancelAction = () => {
    setSelectedComment(null)
    setActionType(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Bekliyor</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Onaylı</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Reddedildi</Badge>
      case 'SPAM':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Spam</Badge>
      default:
        return null
    }
  }

  const getActionMessage = () => {
    switch (actionType) {
      case 'APPROVED':
        return {
          title: 'Yorumu Onayla',
          description: 'Bu yorumu onaylamak istediğinizden emin misiniz? Yorum blog yazısında görünür olacak.',
        }
      case 'REJECTED':
        return {
          title: 'Yorumu Reddet',
          description: 'Bu yorumu reddetmek istediğinizden emin misiniz? Yorum blog yazısında görünmeyecek.',
        }
      case 'SPAM':
        return {
          title: 'Spam Olarak İşaretle',
          description: 'Bu yorumu spam olarak işaretlemek istediğinizden emin misiniz?',
        }
      default:
        return { title: '', description: '' }
    }
  }

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user.image || undefined} alt={`${comment.user.name || comment.user.username || 'Kullanıcı'} profil fotoğrafı`} />
                    <AvatarFallback>
                      {comment.user.name?.[0] || comment.user.username?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {comment.user.name || comment.user.username || 'Anonim'}
                      </p>
                      {comment.user.email && (
                        <span className="text-sm text-muted-foreground">
                          ({comment.user.email})
                        </span>
                      )}
                      {getStatusBadge(comment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="space-y-3">
                <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Blog:</span>
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    target="_blank"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {comment.post.title}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t">
              <div className="flex items-center gap-2 flex-wrap">
                {comment.status !== 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleAction(comment, 'APPROVED')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Onayla
                  </Button>
                )}
                
                {comment.status !== 'REJECTED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleAction(comment, 'REJECTED')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reddet
                  </Button>
                )}
                
                {comment.status !== 'SPAM' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() => handleAction(comment, 'SPAM')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Spam
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!selectedComment && !!actionType} onOpenChange={cancelAction}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getActionMessage().title}</AlertDialogTitle>
            <AlertDialogDescription>
              {getActionMessage().description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAction}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Onayla</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
