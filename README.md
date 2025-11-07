# 🧳 Gezgin Asistan (TravelAsist)

**Akıllı Seyahat Planlama Asistanı**

Seyahat planlamayı tek bir platformda toplayan, yapay zeka destekli, kişiselleştirilmiş bir seyahat planlama uygulaması.

## 📋 Proje Hakkında

Gezgin Asistan, özellikle bütçe dostu gezginler için tasarlanmış, çok şehirli seyahatleri optimize eden bir mobil ve web uygulamasıdır. Kullanıcılar tarih aralığı, bütçe ve gitmek istediği şehirleri girerek, yapay zeka tarafından oluşturulan günlük seyahat planlarına ulaşabilir.

### 🎯 Problem

Kullanıcılar seyahat planlarken:
- Birden fazla web sitesi (uçuş, otel, harita, forum) arasında kayboluyorlar
- En uygun uçuşu bulmak için saatler harcıyorlar
- Şehirler arası rotayı optimize etmekte zorlanıyorlar
- Bütçelerine uygun konaklama aramak zaman alıyor
- Tüm bunları mantıklı bir zaman çizelgesine oturtamıyorlar

### 💡 Çözüm

Kullanıcının temel girdilerini (tarih, bütçe, ülke, şehirler) alıp:
- Uçuş, konaklama ve yerel ulaşım verilerini anlık çeker
- Yapay zeka ile en optimize planı oluşturur
- Gün-gün detaylı seyahat programı sunar
- Toplam maliyet tahmini ve bütçe karşılaştırması yapar

## 🎯 Hedef Kitle

- **Birincil**: 18-35 yaş arası, bütçeye duyarlı gezginler (backpackers, öğrenciler, genç profesyoneller)
- **İkincil**: Planlama karmaşasından bunalan, zamanı kısıtlı olan herkes

## 🏗️ Proje Yapısı

Bu proje bir **monorepo** yapısındadır:

```
TravelAsist/
├── mobile/          # React Native mobil uygulama (Ana arayüz)
├── frontend/        # Next.js web uygulaması
├── backend/         # Node.js/Express API sunucusu
└── docs/            # Proje dokümantasyonu (PRD, vb.)
```

## 🛠️ Teknoloji Yığını

### Mobil Uygulama (Ana Platform)
- **React Native** + **Expo** (~54.0.22)
- **expo-router** - Dosya tabanlı yönlendirme
- **TypeScript** (strict mode)
- Karanlık/Aydınlık tema desteği
- iOS, Android ve Web desteği

### Web Uygulaması
- **Next.js** 16.0.1 (App Router)
- **Tailwind CSS** v4
- **TypeScript**

### Backend (Planlanan)
- **Node.js** + **Express.js**
- **Supabase** (PostgreSQL + Authentication)
- **AI**: LLM API (Gemini veya OpenAI)

### Üçüncü Parti API'ler (Planlanan)
- **Uçuş**: Skyscanner (RapidAPI) veya Kiwi (Tequila API)
- **Konaklama**: Booking.com (RapidAPI) veya Hostelworld API
- **Ulaşım**: Rome2rio API veya 12Go Asia API

## 🚀 Kurulum ve Çalıştırma

### Mobil Uygulama

```bash
# Mobil klasörüne git
cd mobile

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
# veya
npx expo start

# Platform seçenekleri
npm run android    # Android emülatörde çalıştır
npm run ios        # iOS simülatöründe çalıştır
npm run web        # Web tarayıcıda çalıştır

# Kod kalitesi kontrolü
npm run lint
```

### Web Uygulaması

```bash
# Frontend klasörüne git
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev        # http://localhost:3000

# Production build
npm run build
npm start
```

### Backend

```bash
# Backend klasörüne git
cd backend

# Bağımlılıkları yükle
npm install

# Not: Backend henüz geliştirilme aşamasında
```

## ✨ Temel Özellikler

### MVP (Minimum Viable Product) Kapsamı

✅ **Dahil Olanlar:**
- Email/şifre ile kullanıcı kaydı ve girişi
- Tek ülke için seyahat planı oluşturma (başlangıçta Tayland)
- AI tabanlı gün-gün rota optimizasyonu
- Uçuş, konaklama ve ara ulaşım önerileri
- Toplam maliyet tahmini ve bütçe karşılaştırması
- Salt okunur plan görüntüleme

❌ **MVP Dışı (v2.0 için):**
- Uygulama içi rezervasyon/satın alma
- Sürükle-bırak ile plan düzenleme
- Aktivite ve tur önerileri
- Çoklu ülke planlaması
- Google/Apple ile sosyal giriş

## 📱 Kullanım Senaryosu Örneği

**Kullanıcı:** Tayland'a 15-25 Ocak arasında, 1500$ bütçe ile seyahat etmek istiyor.

1. **Giriş**: Kullanıcı hesap oluşturur/giriş yapar
2. **Plan Girişi**:
   - Nereden: Türkiye
   - Nereye: Tayland
   - Tarih: 15-25 Ocak 2026
   - Bütçe: 1500$
   - İlgilenilen şehirler: Bangkok, Phuket, Pattaya
3. **Plan Oluşturma**: AI, en uygun planı oluşturur
4. **Sonuç Görüntüleme**:
   - En ucuz uluslararası uçuş önerisi
   - Gün-gün optimize edilmiş rota (2 gün Bangkok, 1 gün Pattaya, 3 gün Phuket)
   - Her gün için konaklama önerileri
   - Şehirler arası ulaşım detayları
   - Toplam maliyet ve bütçe karşılaştırması

## 🗄️ Veritabanı Yapısı (Planlanan)

```
users                  # Kullanıcı bilgileri (Supabase Auth)
profiles               # Profil detayları
trip_requests          # Kullanıcı istekleri (tarih, bütçe, şehirler, vb.)
generated_plans        # AI tarafından oluşturulan planlar (JSONB)
```

## 🔌 API Yapısı (Planlanan)

```
/auth
  POST /auth/register     # Kullanıcı kaydı
  POST /auth/login        # Kullanıcı girişi

/trips
  POST /trips             # Yeni plan oluştur (AI tetikler)
  GET /trips/:id          # Plan detaylarını getir
  GET /trips/user/:userId # Kullanıcının tüm planları

/planner-service (AI Servisi)
  - 3. parti API'lerden veri çeker
  - LLM ile optimize plan oluşturur
  - JSONB formatında plan döndürür
```

## 📄 Dokümantasyon

- **CLAUDE.md**: Claude Code için teknik rehber
- **docs/PRD.md**: Detaylı Ürün Gereksinimleri Dokümanı (Türkçe)

## 🚧 Proje Durumu

**Mevcut Durum:** Erken MVP geliştirme aşamasında
- ✅ Mobil uygulama temel iskelet kuruldu (Expo + routing + tema)
- ⏳ Backend ve frontend minimal kurulum aşamasında
- ⏳ Temel seyahat planlama özellikleri henüz geliştirilmedi

**Sıradaki Adımlar:**
1. Supabase authentication entegrasyonu
2. Backend API endpoint'lerinin geliştirilmesi
3. Üçüncü parti API entegrasyonları
4. AI prompt mühendisliği ve optimizasyon
5. Mobil uygulamada plan oluşturma UI akışı
6. Plan görüntüleme ekranları

## 🤝 Katkıda Bulunma

Bu proje aktif geliştirme aşamasındadır. Katkıda bulunmak için:

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje özel bir projedir.

## 📧 İletişim

Proje Sahibi: [İletişim bilgileri eklenecek]

---

**Not**: Bu proje geliştirilme aşamasındadır. Özellikler ve dokümantasyon sürekli güncellenmektedir.
