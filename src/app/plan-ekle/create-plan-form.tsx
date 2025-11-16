'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createPlan, saveDraft } from './actions'
import { toast } from 'sonner'
import { Loader2, X, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DailyMenuTabsProps {
  dayCount: number
  duration: number
  loading: boolean
  onAddDay: () => void
  onRemoveDay: (dayNumber: number) => void
  existingDays?: any[]
}

function DailyMenuTabs({ dayCount, duration, loading, onAddDay, onRemoveDay, existingDays }: DailyMenuTabsProps) {
  const [activeTab, setActiveTab] = useState('day1')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Günlük Menüler</CardTitle>
        <CardDescription>
          Her gün için öğün planını ekle (en az 1 gün)
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

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  {dayNumber > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab(`day${dayNumber - 1}`)}
                      disabled={loading}
                    >
                      ← Önceki Gün
                    </Button>
                  )}
                  {dayNumber < dayCount && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab(`day${dayNumber + 1}`)}
                      disabled={loading}
                      className="ml-auto"
                    >
                      Sonraki Gün →
                    </Button>
                  )}
                </div>
              </TabsContent>
            )
            })}
          </Tabs>
        )}

        <div className="bg-muted p-4 rounded-lg mt-4">
          <p className="text-sm text-muted-foreground">
            💡 İpucu: Tablar arasında geçiş yaparak her günü kolayca düzenleyebilirsiniz.
            "Gün Ekle" butonuyla yeni günler ekleyin!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface CreatePlanFormProps {
  existingPlan?: any
}

export function CreatePlanForm({ existingPlan }: CreatePlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [dayCount, setDayCount] = useState(existingPlan?.days?.length || 1)
  const [titleLength, setTitleLength] = useState(existingPlan?.title?.length || 0)
  const [descriptionLength, setDescriptionLength] = useState(existingPlan?.description?.length || 0)
  const [duration, setDuration] = useState(existingPlan?.duration || 0)
  const [difficulty, setDifficulty] = useState(existingPlan?.difficulty || '')
  const [storyLength, setStoryLength] = useState(existingPlan?.authorStory?.length || 0)

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">İlerleme</span>
              <span className="text-muted-foreground">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Planınızı tamamlayın ve yayınlayın
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
      />

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Yayınlanıyor...
            </>
          ) : (
            'Planı Yayınla'
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
                toast.success('Taslak kaydedildi')
              } catch (error: any) {
                toast.error(error.message || 'Bir hata oluştu')
                setLoading(false)
              }
            }
          }}
        >
          Taslak Olarak Kaydet
        </Button>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Planın yayınlanmadan önce admin onayından geçecek. Genellikle 24 saat içinde onaylanır.
      </p>
    </form>
  )
}
