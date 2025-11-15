import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCommentsForModeration } from './actions'
import { CommentActions } from '@/components/admin/comment-actions'

export default async function AdminCommentsPage() {
  const { comments, total } = await getCommentsForModeration()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Yorum Moderasyonu</h1>
        <p className="text-muted-foreground">
          Yorumları incele ve yönet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yorumlar</CardTitle>
          <CardDescription>Toplam {total} yorum</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Yorum</TableHead>
                <TableHead>Yazar</TableHead>
                <TableHead>Hedef</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{comment.body}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {comment.author?.name?.[0] || 'U'}
                      </div>
                      <span className="text-sm">
                        @{comment.author?.username || comment.author?.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{comment.targetType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        comment.status === 'visible' ? 'success' :
                        comment.status === 'pending' ? 'warning' :
                        'destructive'
                      }
                    >
                      {comment.status === 'visible' ? 'Görünür' :
                       comment.status === 'pending' ? 'Bekliyor' :
                       'Gizli'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <CommentActions 
                      commentId={comment.id} 
                      status={comment.status} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
