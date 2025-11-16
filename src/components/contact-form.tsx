'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('✅ Form submit başladı', formData)
    
    // Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      console.log('❌ Validation hatası: İsim')
      toast.error('İsim en az 2 karakter olmalı')
      return
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      console.log('❌ Validation hatası: Email')
      toast.error('Geçerli bir e-posta adresi girin')
      return
    }
    
    if (!formData.subject.trim() || formData.subject.length < 3) {
      console.log('❌ Validation hatası: Konu')
      toast.error('Konu en az 3 karakter olmalı')
      return
    }
    
    if (!formData.message.trim() || formData.message.length < 10) {
      console.log('❌ Validation hatası: Mesaj')
      toast.error('Mesaj en az 10 karakter olmalı')
      return
    }
    
    if (formData.message.length > 1000) {
      console.log('❌ Validation hatası: Mesaj çok uzun')
      toast.error('Mesaj en fazla 1000 karakter olabilir')
      return
    }
    
    console.log('✅ Validation geçti, API isteği başlıyor...')
    setLoading(true)

    try {
      console.log('📡 API isteği gönderiliyor...')
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('API yanıtı:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('API hatası:', error)
        throw new Error(error.message || 'Bir hata oluştu')
      }

      const result = await response.json()
      console.log('Başarılı:', result)

      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
      
      // 5 saniye sonra success mesajını kaldır
      setTimeout(() => setSuccess(false), 5000)
    } catch (error: any) {
      console.error('Form hatası:', error)
      toast.error(error.message || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Mesajınız Gönderildi! 🎉</h3>
        <p className="text-muted-foreground mb-6">
          Teşekkür ederiz! Mesajınızı aldık ve en kısa sürede size dönüş yapacağız.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Yeni Mesaj Gönder
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Adınız Soyadınız *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ahmet Yılmaz"
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresiniz *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="ornek@email.com"
            required
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Konu *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Mesajınızın konusu"
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesajınız *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Mesajınızı buraya yazın..."
          rows={6}
          required
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {formData.message.length} / 1000 karakter
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Mesajı Gönder
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Mesajınızı göndererek <a href="/gizlilik-politikasi" className="text-purple-600 hover:underline">Gizlilik Politikamızı</a> kabul etmiş olursunuz.
      </p>
    </form>
  )
}
