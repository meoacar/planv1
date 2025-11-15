"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, Trash2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { updateRolePermissions } from "@/app/admin/roller/actions"
import { useRouter } from "next/navigation"

interface Permission {
  resource: string
  action: string
  description: string
}

interface RolePermissionManagerProps {
  role: string
  permissions: Permission[]
  allPermissions: Permission[]
}

export function RolePermissionManager({ 
  role, 
  permissions: initialPermissions,
  allPermissions 
}: RolePermissionManagerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(initialPermissions.map(p => `${p.resource}:${p.action}`))
  )

  const togglePermission = (resource: string, action: string) => {
    const key = `${resource}:${action}`
    const newSet = new Set(selectedPermissions)
    
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    
    setSelectedPermissions(newSet)
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      const permissionsToSave = Array.from(selectedPermissions).map(key => {
        const [resource, action] = key.split(':')
        const perm = allPermissions.find(p => p.resource === resource && p.action === action)
        return {
          resource,
          action,
          description: perm?.description || ''
        }
      })
      
      await updateRolePermissions(role, permissionsToSave)
      toast.success('İzinler güncellendi')
      router.refresh()
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = []
    }
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const resourceLabels: Record<string, string> = {
    plan: 'Planlar',
    user: 'Kullanıcılar',
    comment: 'Yorumlar',
    setting: 'Ayarlar',
    stat: 'İstatistikler',
    log: 'Loglar',
    system: 'Sistem'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{role} İzinleri</CardTitle>
            <CardDescription>
              Bu rol için izinleri düzenle
            </CardDescription>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPermissions).map(([resource, perms]) => (
          <div key={resource} className="space-y-3">
            <h3 className="font-semibold text-lg">
              {resourceLabels[resource] || resource}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {perms.map((perm) => {
                const key = `${perm.resource}:${perm.action}`
                const isSelected = selectedPermissions.has(key)
                
                return (
                  <div
                    key={key}
                    onClick={() => togglePermission(perm.resource, perm.action)}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{perm.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {perm.action}
                        </p>
                      </div>
                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
