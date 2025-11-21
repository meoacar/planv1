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
  {
    id: 'mediterranean-21',
    name: 'Akdeniz Diyeti - 21 Gün',
    description: 'Zeytinyağı, balık ve sebze ağırlıklı Akdeniz beslenme planı',
    duration: 21,
    difficulty: 'easy',
    targetWeightLoss: 4,
    tags: 'akdeniz,zeytinyağı,balık,sebze',
    days: [
      {
        dayNumber: 1,
        breakfast: '2 dilim tam buğday ekmeği\nZeytinyağlı ezme\n1 dilim beyaz peynir\nYeşillik\n1 bardak portakal suyu',
        snack1: '1 avuç badem\n1 elma',
        lunch: '150g ızgara levrek\nZeytinyağlı sebze\nYoğurt\nSalata',
        snack2: '1 kase yoğurt\nBal',
        dinner: 'Zeytinyağlı taze fasulye\n1 dilim ekmek\nSalata',
        notes: 'Zeytinyağını bol kullanın. Haftada 3-4 kez balık tüketin.',
      },
    ],
  },
  {
    id: 'detox-5',
    name: 'Detoks Programı - 5 Gün',
    description: 'Vücudu arındıran, hafif ve temizleyici 5 günlük program',
    duration: 5,
    difficulty: 'medium',
    targetWeightLoss: 2,
    tags: 'detoks,temizlik,hafif,sebze',
    days: [
      {
        dayNumber: 1,
        breakfast: 'Yeşil smoothie (ıspanak, muz, elma)\n1 avuç badem',
        snack1: '1 portakal\nBol su',
        lunch: 'Izgara tavuk salatası\nLimonlu zeytinyağı\nBol yeşillik',
        snack2: 'Havuç-elma suyu',
        dinner: 'Sebze çorbası\nBuharda brokoli\nYoğurt',
        notes: 'Günde en az 3 litre su için. Şekerden uzak durun.',
      },
    ],
  },
  {
    id: 'protein-10',
    name: 'Yüksek Protein - 10 Gün',
    description: 'Kas koruyucu, yüksek protein içerikli hızlı kilo verme planı',
    duration: 10,
    difficulty: 'medium',
    targetWeightLoss: 3,
    tags: 'protein,kas,spor,fitness',
    days: [
      {
        dayNumber: 1,
        breakfast: '3 yumurta beyazı omlet\n1 dilim tam buğday ekmeği\n1 dilim hindi',
        snack1: 'Protein shake\n1 muz',
        lunch: '200g ızgara tavuk göğsü\nKinoa\nBol salata',
        snack2: '150g yağsız süzme yoğurt\n1 avuç badem',
        dinner: '200g ızgara ton balığı\nBuharda sebze\nSalata',
        notes: 'Günde 1.5-2g/kg protein alın. Bol su için.',
      },
    ],
  },
  {
    id: 'vegan-14',
    name: 'Vegan Beslenme - 14 Gün',
    description: 'Tamamen bitkisel kaynaklı, dengeli vegan beslenme planı',
    duration: 14,
    difficulty: 'medium',
    targetWeightLoss: 3,
    tags: 'vegan,bitkisel,sağlıklı,sürdürülebilir',
    days: [
      {
        dayNumber: 1,
        breakfast: 'Yulaf lapası (badem sütü ile)\nMuz\nCeviz\nTahini',
        snack1: '1 elma\n1 avuç fındık',
        lunch: 'Nohut salatası\nKinoa\nZeytinyağlı sebze\nHummus',
        snack2: 'Smoothie (muz, ıspanak, badem sütü)',
        dinner: 'Mercimek köftesi\nBulgur pilavı\nSalata\nTahini',
        notes: 'B12 vitamini takviyesi alın. Protein kaynaklarını çeşitlendirin.',
      },
    ],
  },
  {
    id: 'low-carb-21',
    name: 'Düşük Karbonhidrat - 21 Gün',
    description: 'Karbonhidratı azaltılmış, protein ve yağ dengeli plan',
    duration: 21,
    difficulty: 'medium',
    targetWeightLoss: 5,
    tags: 'düşük karbonhidrat,protein,yağ yakımı',
    days: [
      {
        dayNumber: 1,
        breakfast: '2 yumurta\n1 dilim peynir\nZeytin\nDomates, salatalık',
        snack1: '1 avuç ceviz',
        lunch: '150g ızgara köfte\nBol salata\nYoğurt',
        snack2: '50g beyaz peynir\nCeviz',
        dinner: '150g ızgara tavuk\nZeytinyağlı sebze\nSalata',
        notes: 'Günlük karbonhidrat 100g altında. Bol yeşil sebze tüketin.',
      },
    ],
  },
  {
    id: 'dash-14',
    name: 'DASH Diyeti - 14 Gün',
    description: 'Tansiyon dostu, sodyum azaltılmış sağlıklı beslenme planı',
    duration: 14,
    difficulty: 'easy',
    targetWeightLoss: 2,
    tags: 'dash,tansiyon,sağlıklı,düşük tuz',
    days: [
      {
        dayNumber: 1,
        breakfast: 'Yulaf lapası\nMuz\nBal\n1 bardak yağsız süt',
        snack1: '1 elma\n1 avuç badem',
        lunch: 'Fırında tavuk\nEsmер pirinç\nBuharda sebze\nSalata',
        snack2: 'Yağsız yoğurt\nMeyve',
        dinner: 'Izgara balık\nPatates püresi (tuzsuz)\nBol salata',
        notes: 'Tuz kullanımını minimumda tutun. Baharatlarla tatlandırın.',
      },
    ],
  },
  {
    id: 'paleo-14',
    name: 'Paleo Diyeti - 14 Gün',
    description: 'İşlenmemiş, doğal gıdalarla beslenen atalarımızın diyeti',
    duration: 14,
    difficulty: 'hard',
    targetWeightLoss: 4,
    tags: 'paleo,doğal,işlenmemiş,tahılsız',
    days: [
      {
        dayNumber: 1,
        breakfast: '3 yumurta\nAvokado\nDomates\nMantar',
        snack1: '1 avuç karışık kuruyemiş\n1 meyve',
        lunch: '200g ızgara biftek\nTatlı patates\nBol salata',
        snack2: 'Havuç çubukları\nBadem ezmesi',
        dinner: '150g ızgara somon\nBuharda sebze\nSalata',
        notes: 'Tahıl, süt ürünleri ve işlenmiş gıdalardan kaçının.',
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
