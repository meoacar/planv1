'use client'

import { useEffect, useRef, useMemo } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { renderBlogContent, addHeadingIds } from '@/lib/blog/content-renderer'

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // Pre-process content: sanitize, add heading IDs, optimize images
  const processedContent = useMemo(() => {
    let processed = renderBlogContent(content, {
      sanitize: true,
      addImageClasses: true,
      addCodeClasses: true,
      lazyLoadImages: true,
    })
    
    // Add IDs to headings for TOC navigation
    processed = addHeadingIds(processed)
    
    return processed
  }, [content])

  useEffect(() => {
    if (!contentRef.current) return

    // Apply syntax highlighting to code blocks
    const codeBlocks = contentRef.current.querySelectorAll('pre code')
    codeBlocks.forEach((block) => {
      // Only highlight if not already highlighted
      if (!block.classList.contains('hljs')) {
        hljs.highlightElement(block as HTMLElement)
      }
    })

    // Enhance images with figure wrapper and captions
    const images = contentRef.current.querySelectorAll('img')
    images.forEach((img) => {
      // Wrap images in figure if not already wrapped
      if (img.parentElement?.tagName !== 'FIGURE') {
        const figure = document.createElement('figure')
        figure.className = 'my-6'
        img.parentNode?.insertBefore(figure, img)
        figure.appendChild(img)
        
        // Add caption if alt text exists
        if (img.alt) {
          const figcaption = document.createElement('figcaption')
          figcaption.className = 'text-sm text-muted-foreground text-center mt-2 italic'
          figcaption.textContent = img.alt
          figure.appendChild(figcaption)
        }
      }
    })

    // Add smooth scroll behavior to heading links
    const headingLinks = contentRef.current.querySelectorAll('a[href^="#"]')
    headingLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = (link as HTMLAnchorElement).hash.slice(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
  }, [processedContent])

  return (
    <article
      ref={contentRef}
      className="prose prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-base prose-p:leading-7 prose-p:mb-4
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
        prose-strong:font-semibold prose-strong:text-foreground
        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
        prose-li:my-1
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:font-mono
        prose-pre:bg-[#0d1117] prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:shadow-lg
        prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-sm prose-pre:code:text-gray-100
        prose-img:rounded-lg prose-img:shadow-md prose-img:w-full prose-img:h-auto prose-img:object-cover
        prose-figure:my-6 prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:text-center prose-figcaption:mt-2"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
