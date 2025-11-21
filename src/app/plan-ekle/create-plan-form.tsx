'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createPlan, saveDraft } from './actions'
import { toast } from 'sonner'
import { Loader2, X, Plus, Copy, Check } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

interface DailyMenuTabsProps {
  dayCount: number
  duration: number
  loading: boolean
  onAddDay: () => void
  onRemoveDay: (dayNumber: number) => void
  onCopyDay: (fromDay: number, toDays: number[]) => void
  existingDays?: any[]
}

function DailyMenuTabs({ dayCount, duration, loading, onAddDay, onRemoveDay, onCopyDay, existingDays }: DailyMenuTabsProps) {
  const [activeTab, setActiveTab] = useState('day1')
  const [showCopyDialog, setShowCopyDialog] = useState(false)
  const [copyFromDay, setCopyFromDay] = useState(1)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [selectWeekdays, setSelectWeekdays] = useState(false)
  const [selectWeekends, setSelectWeekends] = useState(false)

  const handleCopyClick = (dayNumber: number) => {
    setCopyFromDay(dayNumber)
    setSelectedDays([])
    setSelectAll(false)
    setSelectWeekdays(false)
    setSelectWeekends(false)
    setShowCopyDialog(true)
  }

  const handleCopyConfirm = () => {
    if (selectedDays.length === 0) {
      toast.error('En az bir gün seçmelisiniz')
      return
    }
    onCopyDay(copyFromDay, selectedDays)
    setShowCopyDialog(false)
    toast.success(`${copyFromDay}. gün ${selectedDays.length} güne kopyalandı!`)
  }

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      const allDays = Array.from({ length: dayCount }, (_, i) => i + 1).filter(d => d !== copyFromDay)
      setSelectedDays(allDays)
      setSelectWeekdays(false)
      setSelectWeekends(false)
    } else {
      setSelectedDays([])
    }
  }

  const handleSelectWeekdays = (checked: boolean) => {
    setSelectWeekdays(checked)
    if (checked) {
      const weekdays = Array.from({ length: dayCount }, (_, i) => i + 1)
        .filter(d => d !== copyFromDay && (d % 7 !== 6 && d % 7 !== 0))
      setSelectedDays(weekdays)
      setSelectAll(false)
      setSelectWeekends(false)
    } else {
      setSelectedDays([])
    }
  }

  const handleSelectWeekends = (checked: boolean) => {
    setSelectWeekends(checked)
    if (checked) {
      const weekends = Array.from({ length: dayCount }, (_, i) => i + 1)
        .filter(d => d !== copyFromDay && (d % 7 === 6 || d % 7 === 0))
      setSelectedDays(weekends)
      setSelectAll(false)
      setSelectWeekdays(false)
    } else {
      setSelectedDays([])
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Günlük Menüler</CardTitle>
          <CardDescription>
            Her gün için öğün planını ekle - Süre girildiğinde otomatik oluşturulur
          </CardDescription>
        </CardHeader>
        <CardContent>
          {duration === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ Önce yukarıdan "Süre (gün)" alanını doldurun
              </p>
            </div>
          ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Sticky Tab List */}
            <div className="sticky top-0 z-10 bg-background pb-4 border-b mb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <TabsList className="inline-flex h-auto p-1 bg-muted">
                  {Array.from({ length: dayCount }, (_, i) => i + 1).map((dayNumber) => (
                    <div key={dayNumber} className="relative inline-flex items-center">
                      <TabsTrigger
                        value={`day${dayNumber}`}
                        className="data-[state=active]:bg-background"
                      >
                        {dayNumber}. Gün
                      </TabsTrigger>
                      {dayCount > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveDay(dayNumber)
                            if (activeTab === `day${dayNumber}`) {
                              setActiveTab('day1')
                            }
                          }}
                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center text-destructive hover:text-destructive transition-colors"
                          disabled={loading}
                          aria-label={`${dayNumber}. günü sil`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </TabsList>
                
                {dayCount < duration && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddDay()
                      setActiveTab(`day${dayCount + 1}`)
                    }}
                    disabled={loading}
                    className="flex-shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Gün Ekle
                  </Button>
                )}
              </div>
              
              {dayCount >= duration && (
                <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                  <span>✓</span>
                  <span>Tüm günler eklendi ({dayCount}/{duration})</span>
                </div>
              )}
            </div>

            {/* Tab Contents */}
            {Array.from({ length: dayCount }, (_, i) => i + 1).map((dayNumber) => {
              const existingDay = existingDays?.find(d => d.dayNumber === dayNumber)
              return (
              <TabsContent key={dayNumber} value={`day${dayNumber}`} className="space-y-4 mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-breakfast`}>🍳 Kahvaltı</Label>
                    <Textarea
                      id={`day${dayNumber}-breakfast`}
                      name={`day${dayNumber}-breakfast`}
                      placeholder="Örn: 2 yumurta (omlet), 1 dilim beyaz peynir, Yeşil çay"
                      rows={2}
                      disabled={loading}
                      defaultValue={existingDay?.breakfast || ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-snack1`}>🥜 Ara Öğün 1</Label>
                    <Input
                      id={`day${dayNumber}-snack1`}
                      name={`day${dayNumber}-snack1`}
                      placeholder="Örn: 1 avuç ceviz"
                      disabled={loading}
                      defaultValue={existingDay?.snack1 || ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-lunch`}>🍽️ Öğle Yemeği</Label>
                    <Textarea
                      id={`day${dayNumber}-lunch`}
                      name={`day${dayNumber}-lunch`}
                      placeholder="Örn: Izgara tavuk (150g), Bol yeşil salata"
                      rows={2}
                      disabled={loading}
                      defaultValue={existingDay?.lunch || ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-snack2`}>🍎 Ara Öğün 2</Label>
                    <Input
                      id={`day${dayNumber}-snack2`}
                      name={`day${dayNumber}-snack2`}
                      placeholder="Örn: Yoğurt (şekersiz)"
                      disabled={loading}
                      defaultValue={existingDay?.snack2 || ''}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-dinner`}>🌙 Akşam Yemeği</Label>
                    <Textarea
                      id={`day${dayNumber}-dinner`}
                      name={`day${dayNumber}-dinner`}
                      placeholder="Örn: Izgara somon (150g), Buharda brokoli"
                      defaultValue={existingDay?.dinner || ''}
                      rows={2}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`day${dayNumber}-notes`}>📝 Notlar (opsiyonel)</Label>
                    <Input
                      id={`day${dayNumber}-notes`}
                      name={`day${dayNumber}-notes`}
                      placeholder="Örn: İlk gün biraz açlık hissedebilirsiniz"
                      disabled={loading}
                      defaultValue={existingDay?.notes || ''}
                    />
                  </div>
                </div>

                {/* Copy & Navigation Buttons */}
                <div className="flex justify-between items-center pt-4 border-t gap-2">
                  <div className="flex gap-2">
                    {dayNumber > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab(`day${dayNumber - 1}`)}
                        disabled={loading}
                      >
                        ← Önceki
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyClick(dayNumber)}
                    disabled={loading || dayCount === 1}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Bu Günü Kopyala
                  </Button>

                  <div className="flex gap-2">
                    {dayNumber < dayCount && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab(`day${dayNumber + 1}`)}
                        disabled={loading}
                      >
                        Sonraki →
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            )
            })}
          </Tabs>
        )}

        <div className="bg-muted p-4 rounded-lg mt-4">
          <p className="text-sm text-muted-foreground">
            💡 İpucu: Süre girildiğinde tüm günler otomatik oluşturulur. "Bu Günü Kopyala" ile hızlıca doldurabilirsiniz!
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Copy Dialog */}
    <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Günü Kopyala</DialogTitle>
          <DialogDescription>
            {copyFromDay}. günün menüsünü hangi günlere kopyalamak istersiniz?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Quick Select Options */}
          <div className="space-y-2 pb-3 border-b">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Tüm günler ({dayCount - 1} gün)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-weekdays"
                checked={selectWeekdays}
                onCheckedChange={handleSelectWeekdays}
              />
              <label htmlFor="select-weekdays" className="text-sm font-medium cursor-pointer">
                Hafta içi (Pazartesi-Cuma)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-weekends"
                checked={selectWeekends}
                onCheckedChange={handleSelectWeekends}
              />
              <label htmlFor="select-weekends" className="text-sm font-medium cursor-pointer">
                Hafta sonu (Cumartesi-Pazar)
              </label>
            </div>
          </div>

          {/* Individual Days */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            <p className="text-sm font-medium mb-2">Veya tek tek seçin:</p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: dayCount }, (_, i) => i + 1)
                .filter(d => d !== copyFromDay)
                .map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedDays.includes(day)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-input'
                    }`}
                  >
                    {day}
                  </button>
                ))}
            </div>
          </div>

          {selectedDays.length > 0 && (
            <div className="text-sm text-muted-foreground">
              ✓ {selectedDays.length} gün seçildi
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCopyDialog(false)}
          >
            İptal
          </Button>
          <Button
            type="button"
            onClick={handleCopyConfirm}
            disabled={selectedDays.length === 0}
          >
            <Copy className="h-4 w-4 mr-2" />
            Kopyala
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

interface CreatePlanFormProps {
  existingPlan?: any
}

export function CreatePlanForm({ existingPlan }: CreatePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [dayCount, setDayCount] = useState(existingPlan?.days?.length || 0)
  const [titleLength, setTitleLength] = useState(existingPlan?.title?.length || 0)
  const [descriptionLength, setDescriptionLength] = useState(existingPlan?.description?.length || 0)
  const [duration, setDuration] = useState(existingPlan?.duration || 0)
  const [difficulty, setDifficulty] = useState(existingPlan?.difficulty || '')
  const [storyLength, setStoryLength] = useState(existingPlan?.authorStory?.length || 0)
  const [dayData, setDayData] = useState<Record<number, any>>({})
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout>()

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    if (titleLength > 0 || descriptionLength > 0) {
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave()
      }, 30000) // 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [titleLength, descriptionLength, duration, difficulty])

  const handleAutoSave = async () => {
    if (!formRef.current || loading) return
    
    setAutoSaveStatus('saving')
    try {
      const formData = new FormData(formRef.current)
      await saveDraft(formData)
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Auto-save failed:', error)
      setAutoSaveStatus('idle')
    }
  }

  // Auto-create days when duration changes
  useEffect(() => {
    if (duration > 0 && dayCount === 0 && !existingPlan) {
      setDayCount(duration)
      toast.success(`${duration} günlük plan oluşturuldu! İstediğiniz günleri doldurun.`)
    }
  }, [duration, dayCount, existingPlan])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      await createPlan(formData)
      toast.success('Plan oluşturuldu! Admin onayı bekleniyor.')
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu')
      setLoading(false)
    }
  }

  const addDay = () => {
    if (dayCount < duration) {
      setDayCount(dayCount + 1)
    } else if (duration === 0) {
      // If duration not set, allow adding up to 365
      if (dayCount < 365) {
        setDayCount(dayCount + 1)
      }
    }
  }

  const removeDay = (dayNumber: number) => {
    if (dayCount > 1) {
      setDayCount(dayCount - 1)
    }
  }

  const copyDay = (fromDay: number, toDays: number[]) => {
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    
    // Get source day data
    const sourceData = {
      breakfast: formData.get(`day${fromDay}-breakfast`) as string,
      snack1: formData.get(`day${fromDay}-snack1`) as string,
      lunch: formData.get(`day${fromDay}-lunch`) as string,
      snack2: formData.get(`day${fromDay}-snack2`) as string,
      dinner: formData.get(`day${fromDay}-dinner`) as string,
      notes: formData.get(`day${fromDay}-notes`) as string,
    }

    // Copy to target days
    toDays.forEach(day => {
      const breakfastEl = document.getElementById(`day${day}-breakfast`) as HTMLTextAreaElement
      const snack1El = document.getElementById(`day${day}-snack1`) as HTMLInputElement
      const lunchEl = document.getElementById(`day${day}-lunch`) as HTMLTextAreaElement
      const snack2El = document.getElementById(`day${day}-snack2`) as HTMLInputElement
      const dinnerEl = document.getElementById(`day${day}-dinner`) as HTMLTextAreaElement
      const notesEl = document.getElementById(`day${day}-notes`) as HTMLInputElement

      if (breakfastEl) breakfastEl.value = sourceData.breakfast || ''
      if (snack1El) snack1El.value = sourceData.snack1 || ''
      if (lunchEl) lunchEl.value = sourceData.lunch || ''
      if (snack2El) snack2El.value = sourceData.snack2 || ''
      if (dinnerEl) dinnerEl.value = sourceData.dinner || ''
      if (notesEl) notesEl.value = sourceData.notes || ''
    })
  }

  // Calculate progress - all important fields
  const calculateProgress = () => {
    let completed = 0
    const total = 5
    
    // 1. Title filled (at least 10 characters)
    if (titleLength >= 10) completed++
    
    // 2. Description filled (at least 20 characters)
    if (descriptionLength >= 20) completed++
    
    // 3. Duration set
    if (duration >= 1) completed++
    
    // 4. Difficulty selected
    if (difficulty) completed++
    
    // 5. Story added (optional but recommended)
    if (storyLength >= 50) completed++
    
    return Math.round((completed / total) * 100)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden planId for editing */}
      {existingPlan && (
        <input type="hidden" name="planId" value={existingPlan.id} />
      )}
      
      {/* Hidden dayCount - kaç gün eklendi */}
      <input type="hidden" name="dayCount" value={dayCount} />
      
      {/* Progress Bar with Auto-save Status */}
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">İlerleme</span>
              <div className="flex items-center gap-3">
                {autoSaveStatus === 'saving' && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Kaydediliyor...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Otomatik kaydedildi
                  </span>
                )}
                <span className="text-muted-foreground">{calculateProgress()}%</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Planınızı tamamlayın ve yayınlayın • Otomatik kaydetme aktif
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Temel Bilgiler</CardTitle>
          <CardDescription>Planın hakkında genel bilgiler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Plan Başlığı *</Label>
              <span className="text-xs text-muted-foreground">{titleLength}/100</span>
            </div>
            <Input
              id="title"
              name="title"
              placeholder="Örn: Sağlıklı Beslenme ile 30 Günde Zayıflama"
              maxLength={100}
              required
              disabled={loading}
              defaultValue={existingPlan?.title || ''}
              onChange={(e) => setTitleLength(e.target.value.length)}
            />
            <p className="text-xs text-muted-foreground">
              Dikkat çekici ve açıklayıcı bir başlık seçin
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Kısa Açıklama *</Label>
              <span className="text-xs text-muted-foreground">{descriptionLength}/500</span>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Planın hakkında kısa bir açıklama yaz..."
              rows={4}
              maxLength={500}
              required
              disabled={loading}
              defaultValue={existingPlan?.description || ''}
              onChange={(e) => setDescriptionLength(e.target.value.length)}
            />
            <p className="text-xs text-muted-foreground">
              Bu açıklama keşfet sayfasında görünecek. İnsanları planınızı denemeye ikna edin!
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiketler</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="evde, hızlı, kolay, sağlıklı, ekonomik"
              disabled={loading}
              defaultValue={existingPlan?.tags || ''}
            />
            <p className="text-xs text-muted-foreground">
              Virgülle ayırarak etiket ekleyin (örn: evde, hızlı, kolay)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Süre (gün) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="30"
                min="1"
                max="365"
                required
                disabled={loading}
                defaultValue={existingPlan?.duration || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setDuration(value)
                  // Don't automatically change dayCount - user controls it with + button
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeightLoss">Hedef Kilo Kaybı (kg)</Label>
              <Input
                id="targetWeightLoss"
                name="targetWeightLoss"
                type="number"
                placeholder="10"
                min="0"
                max="100"
                step="0.1"
                disabled={loading}
                defaultValue={existingPlan?.targetWeightLoss || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Zorluk *</Label>
              <select
                id="difficulty"
                name="difficulty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                disabled={loading}
                defaultValue={existingPlan?.difficulty || ''}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Seçiniz...</option>
                <option value="easy">Kolay</option>
                <option value="medium">Orta</option>
                <option value="hard">Zor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Your Story */}
      <Card>
        <CardHeader>
          <CardTitle>Senin Hikayeni</CardTitle>
          <CardDescription>
            Bu planla nasıl başardın? Deneyimlerini paylaş (opsiyonel)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authorStory">Hikayeni Anlat</Label>
            <Textarea
              id="authorStory"
              name="authorStory"
              placeholder="Örn: Pandemi döneminde 15kg aldım ve kendimi çok kötü hissediyordum..."
              rows={6}
              disabled={loading}
              defaultValue={existingPlan?.authorStory || ''}
              onChange={(e) => setStoryLength(e.target.value.length)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorWeightLoss">Kaç kilo verdin? (kg)</Label>
              <Input
                id="authorWeightLoss"
                name="authorWeightLoss"
                type="number"
                placeholder="12"
                min="0"
                max="100"
                step="0.1"
                disabled={loading}
                defaultValue={existingPlan?.authorWeightLoss || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorDuration">Ne kadar sürede? (gün)</Label>
              <Input
                id="authorDuration"
                name="authorDuration"
                type="number"
                placeholder="90"
                min="1"
                max="365"
                disabled={loading}
                defaultValue={existingPlan?.authorDuration || ''}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Menus with Tabs */}
      <DailyMenuTabs
        dayCount={dayCount}
        duration={duration}
        existingDays={existingPlan?.days}
        loading={loading}
        onAddDay={addDay}
        onRemoveDay={removeDay}
        onCopyDay={copyDay}
      />

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {existingPlan ? 'Güncelleniyor...' : 'Yayınlanıyor...'}
            </>
          ) : (
            existingPlan ? 'Planı Güncelle ve Gönder' : 'Planı Yayınla'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={loading}
          onClick={async (e) => {
            const form = e.currentTarget.closest('form')
            if (form) {
              setLoading(true)
              try {
                const formData = new FormData(form)
                await saveDraft(formData)
                toast.success(existingPlan ? 'Taslak güncellendi' : 'Taslak kaydedildi')
              } catch (error: any) {
                toast.error(error.message || 'Bir hata oluştu')
                setLoading(false)
              }
            }
          }}
        >
          {existingPlan ? 'Taslak Olarak Güncelle' : 'Taslak Olarak Kaydet'}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Planın yayınlanmadan önce admin onayından geçecek. Genellikle 24 saat içinde onaylanır.
      </p>
    </form>
  )
}
