'use client'

import { useEffect, useState, useMemo } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TOCItem } from '@/types/blog'
import { extractHeadings } from '@/lib/blog/content-renderer'

interface BlogTOCProps {
  content: string
}

export function BlogTOC({ content }: BlogTOCProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Extract headings using utility function
  const tocItems = useMemo(() => {
    const headings = extractHeadings(content)
    return headings.map(h => ({
      id: h.id,
      text: h.text,
      level: h.level
    })) as TOCItem[]
  }, [content])

  useEffect(() => {
    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    const headings = document.querySelectorAll('h2, h3')
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [tocItems])

  if (tocItems.length === 0) {
    return null
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold" id="toc-heading">
          📑 İçindekiler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav aria-labelledby="toc-heading">
          <ul className="space-y-1" role="list">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'block w-full text-left text-sm py-2 px-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    item.level === 3 && 'pl-6 text-xs',
                    activeId === item.id
                      ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:translate-x-1'
                  )}
                  aria-current={activeId === item.id ? 'location' : undefined}
                  aria-label={`${item.text} bölümüne git`}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </>
  )
}
