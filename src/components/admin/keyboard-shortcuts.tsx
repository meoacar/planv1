"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const shortcuts = [
  { keys: ['Ctrl', 'K'], description: 'Arama', action: 'search' },
  { keys: ['G', 'D'], description: 'Dashboard', path: '/admin' },
  { keys: ['G', 'P'], description: 'Planlar', path: '/admin/planlar' },
  { keys: ['G', 'U'], description: 'Kullanıcılar', path: '/admin/kullanicilar' },
  { keys: ['G', 'C'], description: 'Yorumlar', path: '/admin/yorumlar' },
  { keys: ['G', 'S'], description: 'Ayarlar', path: '/admin/ayarlar' },
  { keys: ['?'], description: 'Kısayolları Göster', action: 'help' },
  { keys: ['Esc'], description: 'Dialog Kapat', action: 'close' },
]

export function KeyboardShortcuts() {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)
  const [pressedKeys, setPressedKeys] = useState<string[]>([])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      const key = e.key.toUpperCase()
      
      // Show help
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault()
        setShowHelp(true)
        return
      }

      // Close dialog
      if (e.key === 'Escape') {
        setShowHelp(false)
        return
      }

      // Ctrl+K for search
      if (e.ctrlKey && key === 'K') {
        e.preventDefault()
        // Focus search input
        const searchInput = document.querySelector('input[placeholder*="ara"]') as HTMLInputElement
        searchInput?.focus()
        return
      }

      // G + X navigation shortcuts
      setPressedKeys(prev => {
        const newKeys = [...prev, key]
        
        // Clear after 1 second
        clearTimeout(timeout)
        timeout = setTimeout(() => setPressedKeys([]), 1000)

        // Check for G + X combinations
        if (newKeys.length === 2 && newKeys[0] === 'G') {
          const shortcut = shortcuts.find(
            s => s.keys.length === 2 && s.keys[0] === 'G' && s.keys[1] === newKeys[1]
          )
          
          if (shortcut?.path) {
            router.push(shortcut.path)
            setPressedKeys([])
          }
        }

        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Klavye Kısayolları</DialogTitle>
          <DialogDescription>
            Admin panelinde hızlı navigasyon için klavye kısayolları
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Navigasyon</h3>
            <div className="space-y-2">
              {shortcuts
                .filter(s => s.path)
                .map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <Badge key={i} variant="outline" className="font-mono">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Genel</h3>
            <div className="space-y-2">
              {shortcuts
                .filter(s => s.action)
                .map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <Badge key={i} variant="outline" className="font-mono">
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              İpucu: <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> tuşuna basarak bu pencereyi açabilirsiniz
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
