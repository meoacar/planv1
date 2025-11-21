'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Sparkles, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface TemplateSelectorProps {
  onSelectTemplate: (template: any) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/plans/templates')
      const result = await res.json()

      if (result.success) {
        setTemplates(result.data)
      } else {
        toast.error('Şablonlar yüklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplateDetails = async (templateId: string) => {
    setLoadingDetails(true)
    try {
      const res = await fetch(`/api/v1/plans/templates?id=${templateId}`)
      const result = await res.json()

      if (result.success) {
        setSelectedTemplate(result.data)
      } else {
        toast.error('Şablon detayları yüklenemedi')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setOpen(false)
      toast.success('Şablon yüklendi! İstediğiniz gibi düzenleyebilirsiniz.')
    }
  }

  useEffect(() => {
    if (open && templates.length === 0) {
      fetchTemplates()
    }
  }, [open])

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  }

  const difficultyLabels = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor',
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Hazır Şablondan Başla
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Plan Şablonları
            </DialogTitle>
            <DialogDescription>
              Hazır şablonlardan birini seçip kendi ihtiyaçlarınıza göre düzenleyebilirsiniz
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => fetchTemplateDetails(template.id)}
                >
                  <Card className={`border-2 transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded ${difficultyColors[template.difficulty as keyof typeof difficultyColors]}`}>
                          {difficultyLabels[template.difficulty as keyof typeof difficultyLabels]}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {template.duration} gün
                        </span>
                        {template.targetWeightLoss && (
                          <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            🎯 {template.targetWeightLoss}kg
                          </span>
                        )}
                      </div>
                      {template.tags && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.split(',').slice(0, 3).map((tag: string, i: number) => (
                            <span key={i} className="text-xs text-muted-foreground">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTemplate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted rounded-lg p-4 space-y-3"
            >
              <h4 className="font-semibold">Seçilen Şablon:</h4>
              <p className="text-sm">{selectedTemplate.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedTemplate.days?.length || 0} gün menü içeriyor
              </p>
            </motion.div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button
              onClick={handleUseTemplate}
              disabled={!selectedTemplate || loadingDetails}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loadingDetails ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Yükleniyor...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Bu Şablonu Kullan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
