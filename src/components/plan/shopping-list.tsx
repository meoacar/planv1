'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ShoppingCart, Download, Check } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface ShoppingListProps {
  planSlug: string
  planTitle: string
}

export function ShoppingList({ planSlug, planTitle }: ShoppingListProps) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const fetchShoppingList = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/plans/${planSlug}/shopping-list`)
      const result = await res.json()

      if (result.success) {
        setData(result.data)
        toast.success('Alışveriş listesi oluşturuldu!')
      } else {
        toast.error(result.error || 'Bir hata oluştu')
      }
    } catch (error) {
      toast.error('Alışveriş listesi oluşturulamadı')
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(item)) {
      newChecked.delete(item)
    } else {
      newChecked.add(item)
    }
    setCheckedItems(newChecked)
  }

  const downloadList = () => {
    if (!data) return

    let text = `${planTitle} - Alışveriş Listesi\n`
    text += `${data.duration} günlük plan\n`
    text += `Toplam ${data.totalItems} ürün\n\n`

    Object.entries(data.categories).forEach(([category, items]: [string, any]) => {
      if (items.length > 0) {
        text += `\n${category}:\n`
        items.forEach((item: string) => {
          text += `  ☐ ${item}\n`
        })
      }
    })

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${planSlug}-alisveris-listesi.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Liste indirildi!')
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Alışveriş Listesi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data ? (
          <Button
            onClick={fetchShoppingList}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Alışveriş Listesi Oluştur
              </>
            )}
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {data.totalItems} ürün
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadList}
              >
                <Download className="h-4 w-4 mr-2" />
                İndir
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(data.categories).map(([category, items]: [string, any]) => {
                if (items.length === 0) return null
                return (
                  <div key={category} className="space-y-2">
                    <p className="font-semibold text-sm bg-muted px-3 py-2 rounded-lg">
                      {category} ({items.length})
                    </p>
                    <div className="space-y-1 pl-2">
                      {items.map((item: string, index: number) => (
                        <button
                          key={`${category}-${index}`}
                          onClick={() => toggleItem(`${category}-${item}`)}
                          className="w-full text-left flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors"
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              checkedItems.has(`${category}-${item}`)
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {checkedItems.has(`${category}-${item}`) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              checkedItems.has(`${category}-${item}`)
                                ? 'line-through text-muted-foreground'
                                : ''
                            }`}
                          >
                            {item}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              💡 İpucu: Listeyi indirip markete giderken yanınızda taşıyabilirsiniz!
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
