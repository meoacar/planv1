"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RoleSelectorProps {
  selectedRole: string
  roles: Array<{ value: string; label: string }>
}

export function RoleSelector({ selectedRole, roles }: RoleSelectorProps) {
  const router = useRouter()

  return (
    <Select 
      value={selectedRole} 
      onValueChange={(value) => {
        router.push(`/admin/roller/duzenle?role=${value}`)
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Rol seç" />
      </SelectTrigger>
      <SelectContent>
        {roles.map(role => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
