"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { initializeDefaultPermissions } from "@/app/admin/roller/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function InitializePermissionsButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    try {
      setLoading(true)
      await initializeDefaultPermissions()
      toast.success('Varsayılan izinler yüklendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleClick} 
      variant="outline" 
      size="sm"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4 mr-2" />
      )}
      Varsayılan İzinleri Yükle
    </Button>
  )
}
