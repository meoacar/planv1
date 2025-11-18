import { BlogContent } from '@/components/blog/blog-content'
import { BlogTOC } from '@/components/blog/blog-toc'

const testContent = `
<h2>Sağlıklı Beslenme İpuçları</h2>
<p>Sağlıklı beslenme, yaşam kalitenizi artırmanın en önemli yollarından biridir. Bu yazıda size pratik ipuçları sunacağız.</p>

<h3>1. Bol Su İçin</h3>
<p>Günde en az <strong>2-3 litre su</strong> içmeye özen gösterin. Su, vücudunuzun düzgün çalışması için <em>hayati önem</em> taşır.</p>

<h3>2. Sebze ve Meyve Tüketin</h3>
<p>Her gün en az 5 porsiyon sebze ve meyve tüketmeye çalışın:</p>
<ul>
<li>Yeşil yapraklı sebzeler (ıspanak, roka)</li>
<li>Mevsim meyveleri</li>
<li>Renkli sebzeler (havuç, biber)</li>
</ul>

<h2>Protein Kaynakları</h2>
<p>Protein, kas gelişimi için çok önemlidir. İşte bazı kaliteli protein kaynakları:</p>

<ol>
<li>Tavuk göğsü</li>
<li>Yumurta</li>
<li>Balık</li>
<li>Baklagiller</li>
</ol>

<h3>Örnek Kod: Kalori Hesaplama</h3>
<p>Günlük kalori ihtiyacınızı hesaplamak için basit bir formül:</p>

<pre><code class="language-typescript">function calculateCalories(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  // Harris-Benedict formülü
  let bmr: number
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  
  return Math.round(bmr)
}

// Örnek kullanım
const dailyCalories = calculateCalories(70, 175, 30, 'male')
console.log(\`Günlük kalori ihtiyacı: \${dailyCalories} kcal\`)
</code></pre>

<h3>Önemli Not</h3>
<blockquote>
<p>Beslenme programınızı oluştururken mutlaka bir diyetisyene danışın. Her bireyin ihtiyaçları farklıdır.</p>
</blockquote>

<h2>Görsel Örnek</h2>
<p>Sağlıklı bir tabak nasıl olmalı?</p>
<img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800" alt="Sağlıklı beslenme tabağı örneği" />

<h3>Bağlantılar</h3>
<p>Daha fazla bilgi için <a href="https://example.com">beslenme rehberimizi</a> inceleyebilirsiniz.</p>

<p>Inline kod örneği: <code>const healthyFood = true</code></p>
`

export default function TestBlogRenderPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog Content Rendering Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <BlogContent content={testContent} />
          </div>
          
          {/* Sidebar with TOC */}
          <div className="lg:col-span-1">
            <BlogTOC content={testContent} />
          </div>
        </div>
      </div>
    </div>
  )
}
