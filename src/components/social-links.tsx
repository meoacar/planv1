"use client"

import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

interface SocialLinksProps {
  facebook?: string
  twitter?: string
  instagram?: string
  youtube?: string
  linkedin?: string
  className?: string
}

export function SocialLinks({ 
  facebook, 
  twitter, 
  instagram, 
  youtube, 
  linkedin,
  className = ''
}: SocialLinksProps) {
  const links = [
    { url: facebook, icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
    { url: twitter, icon: Twitter, label: 'Twitter', color: 'hover:text-sky-500' },
    { url: instagram, icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
    { url: youtube, icon: Youtube, label: 'YouTube', color: 'hover:text-red-600' },
    { url: linkedin, icon: Linkedin, label: 'LinkedIn', color: 'hover:text-blue-700' },
  ].filter(link => link.url)

  if (links.length === 0) return null

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted-foreground transition-colors ${link.color}`}
            aria-label={link.label}
          >
            <Icon className="h-5 w-5" />
          </a>
        )
      })}
    </div>
  )
}
