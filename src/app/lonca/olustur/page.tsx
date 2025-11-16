'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Loader2, 
  Check, 
  X, 
  Sparkles, 
  Users, 
  Target,
  Palette,
  Image as ImageIcon,
  Link2,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const GUILD_ICONS = ['🏰', '⚔️', '🛡️', '👑', '🔥', '⚡', '🌟', '💎', '🦁', '🐉', '🦅', '🐺', '🎯', '💪', '🏆', '⭐'];

const GUILD_COLORS = [
  { name: 'Kırmızı', value: '#ef4444', gradient: 'from-red-500 to-red-600' },
  { name: 'Turuncu', value: '#f97316', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Sarı', value: '#eab308', gradient: 'from-yellow-500 to-yellow-600' },
  { name: 'Yeşil', value: '#22c55e', gradient: 'from-green-500 to-green-600' },
  { name: 'Mavi', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Mor', value: '#a855f7', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Pembe', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Gri', value: '#6b7280', gradient: 'from-gray-500 to-gray-600' },
];

const GUILD_CATEGORIES = [
  { id: 'fitness', label: '💪 Fitness', description: 'Spor ve egzersiz odaklı' },
  { id: 'diet', label: '🥗 Diyet', description: 'Beslenme ve sağlıklı yaşam' },
  { id: 'motivation', label: '🔥 Motivasyon', description: 'Destek ve ilham' },
  { id: 'challenge', label: '🎯 Challenge', description: 'Yarışma ve hedefler' },
  { id: 'lifestyle', label: '🌟 Yaşam Tarzı', description: 'Genel sağlık ve wellness' },
];

const GUILD_TEMPLATES = [
  {
    name: 'Yaz Hazırlığı Ekibi',
    description: 'Yaza fit girmek isteyenler için',
    icon: '☀️',
    category: 'fitness',
    maxMembers: 30,
  },
  {
    name: 'Sabah Sporcuları',
    description: 'Sabah erken kalkan ve spor yapan topluluk',
    icon: '🌅',
    category: 'fitness',
    maxMembers: 50,
  },
  {
    name: 'Vegan Savaşçılar',
    description: 'Bitkisel beslenme ile zayıflama',
    icon: '🌱',
    category: 'diet',
    maxMembers: 40,
  },
];

export default function CreateGuildPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🏰');
  const [selectedColor, setSelectedColor] = useState(GUILD_COLORS[4]);
  const [selectedCategory, setSelectedCategory] = useState('fitness');
  const [isPublic, setIsPublic] = useState(true);
  const [maxMembers, setMaxMembers] = useState(50);
  const [rules, setRules] = useState('');
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const newSlug = generateSlug(name);
      setSlug(newSlug);
    }
  }, [name]);

  // Check slug availability
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await fetch(`/api/v1/guilds/check-slug?slug=${slug}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch (error) {
        console.error('Slug check error:', error);
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const applyTemplate = (template: typeof GUILD_TEMPLATES[0]) => {
    setName(template.name);
    setDescription(template.description);
    setSelectedIcon(template.icon);
    setSelectedCategory(template.category);
    setMaxMembers(template.maxMembers);
    setShowTemplates(false);
    toast.success('Şablon uygulandı!');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name,
        slug,
        description: description || undefined,
        icon: selectedIcon,
        color: selectedColor.value,
        category: selectedCategory,
        isPublic,
        maxMembers,
        rules: rules || undefined,
        monthlyGoal: monthlyGoal || undefined,
      };

      const res = await fetch('/api/v1/guilds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Lonca oluşturulamadı');
      }

      const result = await res.json();
      toast.success('🎉 Loncanız oluşturuldu ve admin onayı bekliyor!');
      router.push('/lonca');
    } catch (error: any) {
      toast.error(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!name || !description || slugAvailable === false)) {
      toast.error('Lütfen tüm alanları doldurun ve geçerli bir isim seçin');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <>
      <Navbar />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/lonca"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Loncalara Dön
        </Link>

        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            🏰 Lonca Oluştur
          </h1>
          <p className="text-muted-foreground">
            Kendi loncanı oluştur ve lider ol!
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </motion.div>
                {s < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded ${
                    step > s ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-16 mt-2">
            <span className={`text-xs ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Temel Bilgiler
            </span>
            <span className={`text-xs ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Görünüm
            </span>
            <span className={`text-xs ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Ayarlar
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Templates */}
                <Card className="border-dashed">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Hızlı Başlangıç
                        </CardTitle>
                        <CardDescription>Hazır şablonlardan birini seç</CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplates(!showTemplates)}
                      >
                        {showTemplates ? 'Gizle' : 'Göster'}
                      </Button>
                    </div>
                  </CardHeader>
                  {showTemplates && (
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {GUILD_TEMPLATES.map((template) => (
                          <motion.button
                            key={template.name}
                            type="button"
                            onClick={() => applyTemplate(template)}
                            className="p-4 border rounded-lg text-left hover:border-primary transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="text-3xl mb-2">{template.icon}</div>
                            <h4 className="font-semibold mb-1">{template.name}</h4>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Temel Bilgiler</CardTitle>
                    <CardDescription>Loncanın adı ve açıklaması</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Lonca Adı *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Örn: Kış Savaşçıları"
                        maxLength={50}
                        required
                        disabled={loading}
                      />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Benzersiz ve akılda kalıcı bir isim seçin
                        </span>
                        <span className={name.length > 40 ? 'text-orange-500' : 'text-muted-foreground'}>
                          {name.length}/50
                        </span>
                      </div>
                    </div>

                    {/* Slug Preview */}
                    {slug && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-mono">
                              /lonca/{slug}
                            </span>
                          </div>
                          {checkingSlug ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : slugAvailable === true ? (
                            <div className="flex items-center gap-1 text-green-500">
                              <Check className="h-4 w-4" />
                              <span className="text-xs">Müsait</span>
                            </div>
                          ) : slugAvailable === false ? (
                            <div className="flex items-center gap-1 text-red-500">
                              <X className="h-4 w-4" />
                              <span className="text-xs">Kullanılıyor</span>
                            </div>
                          ) : null}
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="description">Açıklama *</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Loncanızın amacını ve hedeflerini açıklayın..."
                        rows={4}
                        maxLength={500}
                        required
                        disabled={loading}
                      />
                      <div className="flex justify-end text-xs">
                        <span className={description.length > 450 ? 'text-orange-500' : 'text-muted-foreground'}>
                          {description.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Kategori *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {GUILD_CATEGORIES.map((cat) => (
                          <motion.button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`p-3 border rounded-lg text-left transition-all ${
                              selectedCategory === cat.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="font-semibold text-sm mb-1">{cat.label}</div>
                            <div className="text-xs text-muted-foreground">{cat.description}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!name || !description || slugAvailable === false}
                  >
                    Devam Et
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Appearance */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Icon Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Lonca İkonu
                    </CardTitle>
                    <CardDescription>Loncanızı temsil edecek bir ikon seçin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {GUILD_ICONS.map((icon) => (
                        <motion.button
                          key={icon}
                          type="button"
                          onClick={() => setSelectedIcon(icon)}
                          className={`text-4xl p-4 rounded-lg border-2 transition-all ${
                            selectedIcon === icon
                              ? 'border-primary bg-primary/10 scale-110'
                              : 'border-border hover:border-primary/50'
                          }`}
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={loading}
                        >
                          {icon}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Color Theme */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Renk Teması
                    </CardTitle>
                    <CardDescription>Loncanızın ana rengini seçin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {GUILD_COLORS.map((color) => (
                        <motion.button
                          key={color.value}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`relative h-16 rounded-lg border-2 transition-all ${
                            selectedColor.value === color.value
                              ? 'border-foreground scale-110'
                              : 'border-border hover:border-foreground/50'
                          }`}
                          style={{ backgroundColor: color.value }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={loading}
                        >
                          {selectedColor.value === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Check className="h-6 w-6 text-white drop-shadow-lg" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Preview Card */}
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Önizleme
                    </CardTitle>
                    <CardDescription>Loncanız nasıl görünecek</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      className="relative rounded-lg overflow-hidden border"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {/* Banner */}
                      <div 
                        className={`h-32 bg-gradient-to-r ${selectedColor.gradient} relative`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-4 left-4 flex items-end gap-4">
                          <div className="w-20 h-20 rounded-xl bg-background border-4 border-background flex items-center justify-center text-4xl shadow-lg">
                            {selectedIcon}
                          </div>
                          <div className="text-white pb-2">
                            <h3 className="font-bold text-xl drop-shadow-lg">{name || 'Lonca Adı'}</h3>
                            <p className="text-sm opacity-90 drop-shadow">
                              {GUILD_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4 bg-card">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {description || 'Lonca açıklaması buraya gelecek...'}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>0/{maxMembers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{isPublic ? 'Herkese Açık' : 'Özel'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Geri
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1"
                  >
                    Devam Et
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Settings */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lonca Ayarları</CardTitle>
                    <CardDescription>Kurallar ve limitler</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxMembers">Maksimum Üye Sayısı</Label>
                      <Input
                        id="maxMembers"
                        type="number"
                        value={maxMembers}
                        onChange={(e) => setMaxMembers(parseInt(e.target.value) || 50)}
                        min="5"
                        max="100"
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        5 ile 100 arasında bir değer girin
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic" className="text-base">
                          Herkese Açık
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Herkes loncanızı görebilir ve katılabilir
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isPublic}
                        onClick={() => setIsPublic(!isPublic)}
                        disabled={loading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isPublic ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isPublic ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Rules & Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Kurallar ve Hedefler
                    </CardTitle>
                    <CardDescription>Lonca manifestosu ve hedefler (opsiyonel)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rules">Lonca Kuralları</Label>
                      <Textarea
                        id="rules"
                        value={rules}
                        onChange={(e) => setRules(e.target.value)}
                        placeholder="Örn: Her gün en az 30 dakika egzersiz, Haftalık tartı paylaşımı zorunlu..."
                        rows={4}
                        maxLength={1000}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Üyelerin uyması gereken kuralları belirtin
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyGoal">Aylık Hedef</Label>
                      <Input
                        id="monthlyGoal"
                        value={monthlyGoal}
                        onChange={(e) => setMonthlyGoal(e.target.value)}
                        placeholder="Örn: Toplam 100 kg vermek"
                        maxLength={100}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Loncanın bu ay ulaşmak istediği hedef
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-2">💡 Lonca Lideri Olarak</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Üyeleri yönetebilir ve officer atayabilirsiniz</li>
                          <li>• Challenge'lar oluşturup loncanızı motive edebilirsiniz</li>
                          <li>• Liderlik tablosunda diğer loncalarla yarışabilirsiniz</li>
                          <li>• Lonca istatistiklerini ve gelişimini takip edebilirsiniz</li>
                          <li>• Özel etkinlikler ve ödüller düzenleyebilirsiniz</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Geri
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Oluşturuluyor...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Lonca Oluştur
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </>
  );
}
