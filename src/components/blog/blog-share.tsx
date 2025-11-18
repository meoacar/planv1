'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BlogShareProps {
  title: string
  slug: string
}

export function BlogShare({ title, slug }: BlogShareProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/blog/${slug}`
    : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link kopyalandı!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Link kopyalanamadı')
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <>
      <CardContent className="p-6">
        <p className="text-lg font-semibold mb-4" id="share-heading">
          🔗 Paylaş
        </p>
        <nav aria-labelledby="share-heading">
          <div className="flex flex-col gap-2" role="list">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-500 transition-all"
              onClick={() => handleShare('twitter')}
              aria-label="Twitter'da paylaş"
            >
              <Twitter className="w-4 h-4 mr-2 text-blue-500" aria-hidden="true" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-600 transition-all"
              onClick={() => handleShare('facebook')}
              aria-label="Facebook'ta paylaş"
            >
              <Facebook className="w-4 h-4 mr-2 text-blue-600" aria-hidden="true" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-700 transition-all"
              onClick={() => handleShare('linkedin')}
              aria-label="LinkedIn'de paylaş"
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-700" aria-hidden="true" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start transition-all",
                copied && "bg-green-50 dark:bg-green-950 border-green-500"
              )}
              onClick={handleCopyLink}
              aria-label={copied ? "Link kopyalandı" : "Linki kopyala"}
              aria-live="polite"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-green-500" aria-hidden="true" />
              ) : (
                <LinkIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              )}
              {copied ? 'Kopyalandı!' : 'Link Kopyala'}
            </Button>
          </div>
        </nav>
      </CardContent>
    </>
  )
}
