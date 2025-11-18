/**
 * Blog content rendering utilities
 * Converts Tiptap HTML to optimized, sanitized HTML for display
 */

import DOMPurify from 'isomorphic-dompurify'

// Re-export utility functions from blog-utils
export { 
  calculateReadingTime, 
  generateSlug, 
  extractExcerpt,
  sanitizeContent,
  generateTOC,
  addAnchorLinks,
} from './blog-utils'

export interface RenderOptions {
  sanitize?: boolean
  addImageClasses?: boolean
  addCodeClasses?: boolean
  lazyLoadImages?: boolean
}

/**
 * Render Tiptap HTML content with optimizations
 */
export function renderBlogContent(
  html: string,
  options: RenderOptions = {}
): string {
  const {
    sanitize = true,
    addImageClasses = true,
    addCodeClasses = true,
    lazyLoadImages = true,
  } = options

  let content = html

  // Sanitize HTML to prevent XSS
  if (sanitize) {
    content = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'h2',
        'h3',
        'p',
        'br',
        'strong',
        'em',
        'u',
        'a',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'img',
        'figure',
        'figcaption',
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'title',
        'class',
        'style',
        'target',
        'rel',
        'loading',
      ],
    })
  }

  // Add responsive image classes
  if (addImageClasses) {
    content = content.replace(
      /<img([^>]*)>/g,
      (match, attrs) => {
        let newAttrs = attrs
        
        // Add responsive classes
        if (!attrs.includes('class=')) {
          newAttrs += ' class="w-full h-auto rounded-lg shadow-md"'
        }
        
        // Add lazy loading
        if (lazyLoadImages && !attrs.includes('loading=')) {
          newAttrs += ' loading="lazy"'
        }
        
        return `<img${newAttrs}>`
      }
    )
  }

  // Add code block classes for syntax highlighting
  if (addCodeClasses) {
    content = content.replace(
      /<pre><code([^>]*)>/g,
      '<pre><code$1 class="hljs">'
    )
  }

  return content
}

/**
 * Extract plain text from HTML content
 */
export function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Extract all headings from HTML content for TOC
 */
export interface Heading {
  id: string
  text: string
  level: number
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = []
  const headingRegex = /<h([23])>(.*?)<\/h[23]>/g
  
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    headings.push({ id, text, level })
  }
  
  return headings
}

/**
 * Add IDs to headings in HTML content
 */
export function addHeadingIds(html: string): string {
  return html.replace(
    /<h([23])>(.*?)<\/h[23]>/g,
    (match, level, text) => {
      const plainText = text.replace(/<[^>]*>/g, '').trim()
      const id = plainText
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      return `<h${level} id="${id}">${text}</h${level}>`
    }
  )
}
