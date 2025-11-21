import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const templates = [
  {
    id: 'keto-7',
    name: 'Ketojenik Diyet - 7 Gün',
    description: 'Düşük karbonhidrat, yüksek yağ içeren ketojenik diyet planı',
    duration: 7,
    difficulty: 'medium',
    targetWeightLoss: 2,
    tags: 'keto,düşük karbonhidrat,yüksek yağ',
    days: [
      {
        dayNumber: 1,
        breakfast: '2 yumurta omlet (tereyağı ile)\n1 dilim beyaz peynir\n5-6 zeytin\nSınırsız yeşillik',
        snack1: '1 avuç ceviz',
        lunch: '150g ızgara tavuk\nBol yeşil salata (zeytinyağlı)\n1 kase yoğurt',
        snack2: '50g kaşar peyniri',
        dinner: '150g ızgara somon\nBuharda brokoli\nZeytinyağlı salata',
        notes: 'Bol su için. Günde en az 2-3 litre su tüketin.',
      },
      {
        dayNumber: 2,
        breakfast: 'Menemen (2 yumurta, domates, biber)\n1 dilim beyaz peynir\nZeytin',
        snack1: '1 avuç badem',
        lunch: '150g köfte\nYoğurtlu salata\nZeytinyağlı sebze',
        snack2: 'Protein shake',
        dinner: '150g ızgara tavuk but\nKarnabahar püresi\nYeşil salata',
        notes: 'Karbonhidrat alımını 50g altında tutun.',
      },
    ],
  },
  {
    id: 'balanced-14',
    name: 'Dengeli Beslenme - 14 Gün',
    description: 'Tüm besin gruplarını içeren dengeli ve sürdürülebilir plan',
    duration: 14,
    difficulty: 'easy',
    targetWeightLoss: 3,
    tags: 'dengeli,sürdürülebilir,sağlıklı',
    days: [
      {
        dayNumber: 1,
        breakfast: '2 dilim tam buğday ekmeği\n1 yumurta\n1 dilim beyaz peynir\nDomates, salatalık\n1 bardak süt',
        snack1: '1 meyve (elma veya portakal)',
        lunch: '1 porsiyon tavuklu makarna\nYoğurt\nSalata',
        snack2: '1 kase yoğurt\n1 avuç fındık',
        dinner: '150g ızgara balık\n1 porsiyon bulgur pilavı\nSalata',
        notes: 'Öğünleri atlama. Düzenli beslen.',
      },
    ],
  },
  {
    id: 'intermittent-30',
    name: 'Aralıklı Oruç - 30 Gün',
    description: '16/8 aralıklı oruç yöntemi ile kilo verme planı',
    duration: 30,
    difficulty: 'hard',
    targetWeightLoss: 5,
    tags: 'aralıklı oruç,16/8,intermittent fasting',
    days: [
      {
        dayNumber: 1,
        breakfast: 'Oruç (sadece su, çay, kahve)',
        snack1: 'Oruç',
        lunch: '12:00 - İlk öğün\n150g tavuk\nBol salata\n1 porsiyon pirinç',
        snack2: '1 meyve\n1 avuç kuruyemiş',
        dinner: '19:00 - Son öğün\n150g et/balık\nSebze yemeği\nYoğurt',
        notes: 'Yeme penceresi: 12:00-20:00. Bol su için.',
      },
    ],
  },
]

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const templateId = searchParams.get('id')

    if (templateId) {
      const template = templates.find((t) => t.id === templateId)
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: template })
    }

    return NextResponse.json({
      success: true,
      data: templates.map(({ days, ...template }) => ({
        ...template,
        previewDays: days.length,
      })),
    })
  } catch (error) {
    console.error('Templates error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
