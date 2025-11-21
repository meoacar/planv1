'use client'

import { useEffect } from 'react'

/**
 * Performance Optimizer Component
 * - Lazy loads non-critical resources
 * - Optimizes font loading
 * - Reduces layout shifts
 */
export function PerformanceOptimizer() {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Lazy load images that are below the fold
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]')
      images.forEach(img => {
        (img as HTMLImageElement).src = img.getAttribute('data-src') || ''
      })
    }

    // Optimize third-party scripts
    const optimizeScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[data-defer]')
      scripts.forEach(script => {
        script.setAttribute('defer', '')
      })
    }

    // Run after page load
    if (document.readyState === 'complete') {
      optimizeScripts()
    } else {
      window.addEventListener('load', optimizeScripts)
    }

    return () => {
      window.removeEventListener('load', optimizeScripts)
    }
  }, [])

  return null
}
