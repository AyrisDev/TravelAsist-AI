# TravelAsist-AI Kurulum ve Test Rehberi

Bu rehber, projeyi sıfırdan kurup test etmek için gereken tüm adımları içerir.

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Git
- Supabase hesabı (ücretsiz)
- iOS Simulator (Mac için) veya Android Emulator

---

## 🚀 Adım Adım Kurulum

### 1️⃣ Supabase Projesini Oluşturun

#### a) Supabase Hesabı ve Proje
1. [supabase.com](https://supabase.com) adresine gidin ve giriş yapın
2. "New Project" butonuna tıklayın
3. Proje bilgilerini girin:
   - **Name**: TravelAsist-AI
   - **Database Password**: Güçlü bir şifre (kaydedin!)
   - **Region**: Europe West (veya size en yakın)
4. "Create new project" butonuna tıklayın (2-3 dakika sürer)

#### b) Database Schema Kurulumu
1. Proje oluşturulunca sol menüden **SQL Editor** sekmesine gidin
2. "New query" butonuna tıklayın
3. `docs/database-schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. **RUN** butonuna tıklayın
5. ✅ Success mesajı almalısınız

#### c) API Credentials
1. Sol menüden **Settings** → **API** sekmesine gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJ...` ile başlayan token
   - **service_role key**: `eyJ...` ile başlayan başka bir token

#### d) Email Auth Ayarları (Geliştirme İçin)
1. Sol menüden **Authentication** → **Providers** → **Email**
2. **Confirm email** seçeneğini KAPATIN (geliştirme için)
3. **Save** butonuna tıklayın

---

### 2️⃣ Backend Kurulumu

```bash
# Backend klasörüne gidin
cd backend

# Dependencies'leri yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

#### .env dosyasını düzenleyin:
```env
PORT=3001
NODE_ENV=development

# Supabase'den aldığınız bilgiler
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

ALLOWED_ORIGINS=http://localhost:8081,http://localhost:3000,exp://192.168.1.x:8081
```

#### Backend'i çalıştırın:
```bash
npm run dev
```

✅ Şu mesajları görmelisiniz:
```
🚀 Server is running on port 3001
📍 Environment: development
🔗 Health check: http://localhost:3001/health
```

#### Backend'i test edin (yeni terminal):
```bash
curl http://localhost:3001/health
```

✅ Response:
```json
{
  "success": true,
  "message": "TravelAsist API is running",
  "timestamp": "2025-11-13T..."
}
```

---

### 3️⃣ Mobile App Kurulumu

```bash
# Yeni terminal açın
cd mobile

# Dependencies'leri yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env
```

#### .env dosyasını düzenleyin:
```env
# Supabase'den aldığınız bilgiler
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:3001
```

#### Mobile app'i çalıştırın:
```bash
npm start
```

✅ QR kod ve seçenekler görmelisiniz:
- `i` - iOS Simulator
- `a` - Android Emulator
- `w` - Web Browser

---

## 🧪 Authentication Test Senaryoları

### Senaryo 1: Yeni Kullanıcı Kaydı

1. **Kayıt Ekranına Gidin**
   - App açıldığında otomatik olarak Login ekranına yönlendirilirsiniz
   - "Kayıt Olun" linkine tıklayın

2. **Bilgileri Doldurun**
   - Ad Soyad: `Test Kullanıcı` (opsiyonel)
   - Kullanıcı Adı: `testuser` (opsiyonel)
   - Email: `test@example.com`
   - Şifre: `test123456`
   - Şifre Tekrar: `test123456`

3. **Kayıt Ol Butonuna Tıklayın**
   - ✅ "Başarılı! Hesabınız oluşturuldu" mesajı
   - ✅ Otomatik olarak Home ekranına yönlendirilir

4. **Supabase'de Kontrol Edin**
   - Supabase Dashboard → Authentication → Users
   - ✅ Yeni kullanıcı listede görünmeli

### Senaryo 2: Giriş Yapma

1. **Logout Yapın**
   - Home ekranında "Çıkış Yap" butonuna tıklayın
   - "Evet" ile onaylayın
   - ✅ Login ekranına yönlendirilir

2. **Giriş Yapın**
   - Email: `test@example.com`
   - Şifre: `test123456`
   - "Giriş Yap" butonuna tıklayın
   - ✅ Home ekranına yönlendirilir
   - ✅ Kullanıcı bilgileri görünür

### Senaryo 3: Hatalı Giriş Denemeleri

1. **Yanlış Şifre**
   - Email: `test@example.com`
   - Şifre: `wrongpassword`
   - ✅ "Invalid email or password" hatası almalısınız

2. **Eksik Bilgi**
   - Sadece email girin, şifre boş bırakın
   - ✅ "Lütfen email ve şifrenizi girin" hatası almalısınız

3. **Kayıtsız Email**
   - Email: `nonexistent@example.com`
   - Şifre: `anypassword`
   - ✅ "Invalid email or password" hatası almalısınız

### Senaryo 4: Session Persistence

1. **Giriş Yapın**
   - Email: `test@example.com`
   - Şifre: `test123456`

2. **Uygulamayı Kapatın**
   - App'i tamamen kapatın (kill process)

3. **Uygulamayı Tekrar Açın**
   - `npm start` ile yeniden başlatın
   - ✅ Otomatik olarak Home ekranına yönlendirilmelisiniz
   - ✅ Tekrar giriş yapmanız gerekmemeli

---

## 🗺️ Trip Planning Test Senaryoları

### Senaryo 5: Yeni Seyahat Planı Oluşturma

1. **Home Ekranında**
   - ✅ "✈️ Yeni Plan Oluştur" butonu görünmeli
   - Butona tıklayın

2. **Step 1: Plan Bilgileri**
   - **Nereden**: `Turkey` (varsayılan)
   - **Nereye**: `Thailand` (varsayılan)
   - **Gidiş Tarihi**: Bugünden sonra bir tarih seçin (örn: 15 Ocak 2026)
   - **Dönüş Tarihi**: Gidiş tarihinden 7-10 gün sonra (örn: 25 Ocak 2026)
   - **Bütçe**: `1500` USD
   - ✅ "Sonraki Adım →" butonuna tıklayın

3. **Step 2: Şehir Seçimi**
   - ✅ Popüler şehirler ve diğer şehirler listelenmeli
   - En az 2-3 şehir seçin (örn: Bangkok, Phuket, Chiang Mai)
   - ✅ "Seçili: X" sayacı güncellenmeli
   - ✅ "Sonraki →" butonu aktif olmalı
   - "Sonraki →" butonuna tıklayın

4. **Step 3: Tercihler**
   - **Konaklama**: Bir seçenek seçin (örn: Hostel)
   - **Seyahat Tarzı**: Bir stil seçin (örn: Yavaş)
   - ✅ Plan özeti doğru görünmeli
   - ✅ "🎉 Planı Oluştur" butonuna tıklayın

5. **Başarı Kontrolü**
   - ✅ "Başarılı! 🎉" mesajı görünmeli
   - ✅ Home ekranına yönlendirilmeli

6. **Backend Kontrolü**
   - Supabase Dashboard → Table Editor → `trip_requests`
   - ✅ Yeni kayıt oluşmuş olmalı
   - ✅ `status` = `pending`
   - ✅ Tüm bilgiler doğru kaydedilmiş olmalı

### Senaryo 6: Form Validasyonları

1. **Step 1 Validasyonları**
   - Tüm alanları boş bırakın → ✅ "Lütfen nereden gittiğinizi belirtin" hatası
   - Sadece "Nereden" doldurun → ✅ "Nereye gideceğinizi belirtin" hatası
   - Bütçe `0` girin → ✅ "Geçerli bir bütçe girin" hatası
   - Dönüş tarihini gidiş tarihinden önce seçin → ✅ Hata mesajı

2. **Step 2 Validasyonları**
   - Hiç şehir seçmeden "Sonraki" tıklayın → ✅ Buton disabled olmalı
   - 1 şehir seçin → ✅ "Sonraki" aktif olmalı
   - 6 şehir seçmeye çalışın → ✅ "Maksimum 5 şehir" hatası

3. **Geri Dönme**
   - Step 2'den "← Geri" tıklayın → ✅ Step 1'e dönmeli
   - ✅ Doldurduğunuz bilgiler korunmuş olmalı
   - Step 3'ten geri dönün → ✅ Seçili şehirler korunmuş olmalı

### Senaryo 7: Backend API Testi

Backend API'yi doğrudan test etmek için:

```bash
# Önce login olup token alın
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Response'daki access_token'ı kopyalayın, sonra:
export TOKEN="your-access-token-here"

# Trip oluşturun
curl -X POST http://localhost:3001/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "origin": "Turkey",
    "destination": "Thailand",
    "start_date": "2026-01-15",
    "end_date": "2026-01-25",
    "budget": 1500,
    "requested_cities": ["Bangkok", "Phuket"],
    "accommodation_preference": "hostel",
    "travel_style": "slow"
  }'

# Tüm trip'leri listeleyin
curl -X GET http://localhost:3001/api/trips \
  -H "Authorization: Bearer $TOKEN"
```

✅ Expected: Her istek `success: true` dönmeli

---

## 🔍 Troubleshooting

### Backend çalışmıyor
```bash
# Port kullanımda mı kontrol et
lsof -i :3001

# Node modules'leri temizle
rm -rf node_modules package-lock.json
npm install
```

### Mobile app hata veriyor
```bash
# Cache'leri temizle
npx expo start -c

# Node modules'leri yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Supabase bağlantı hatası
- `.env` dosyasındaki credentials'ları kontrol edin
- Supabase Dashboard'da projenin aktif olduğunu doğrulayın
- Browser'da Project URL'ye giderek erişilebilir olduğunu test edin

### "Module not found" hatası
```bash
# TypeScript cache'i temizle
rm -rf .expo
npm start -- --clear
```

---

## 📁 Proje Yapısı

```
TravelAsist-AI/
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── config/       # Supabase client
│   │   ├── controllers/  # Auth logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   └── index.ts      # Server entry
│   └── .env              # Backend env vars
│
├── mobile/               # React Native mobile app
│   ├── app/
│   │   ├── (auth)/      # Login/Register screens
│   │   ├── (tabs)/      # Main app screens
│   │   └── index.tsx    # Entry with auth redirect
│   ├── contexts/        # Auth context
│   ├── lib/            # Supabase client
│   └── .env            # Mobile env vars
│
├── docs/
│   ├── PRD.md                 # Product requirements (Turkish)
│   └── database-schema.sql    # Database setup
│
├── SUPABASE_SETUP.md    # Supabase kurulum rehberi
└── SETUP_GUIDE.md       # Bu dosya
```

---

## ✅ Checklist

### Supabase
- [ ] Proje oluşturuldu
- [ ] Database schema çalıştırıldı
- [ ] API credentials alındı
- [ ] Email confirmation kapatıldı

### Backend
- [ ] Dependencies yüklendi
- [ ] .env dosyası yapılandırıldı
- [ ] Server başlatıldı
- [ ] Health check çalışıyor

### Mobile
- [ ] Dependencies yüklendi
- [ ] .env dosyası yapılandırıldı
- [ ] App başlatıldı
- [ ] Login ekranı görünüyor

### Test - Authentication
- [ ] Yeni kullanıcı kaydı çalışıyor
- [ ] Giriş yapma çalışıyor
- [ ] Logout çalışıyor
- [ ] Session persist ediyor

### Test - Trip Planning
- [ ] Trip form Step 1 çalışıyor
- [ ] Date picker çalışıyor
- [ ] Trip form Step 2 çalışıyor
- [ ] Şehir seçimi çalışıyor
- [ ] Trip form Step 3 çalışıyor
- [ ] Backend'e trip request gönderimi başarılı
- [ ] Supabase'de trip kaydı oluşuyor

---

## 🎯 Sonraki Adımlar (PRD'ye Göre)

### ✅ Tamamlanan
- [x] **US-1**: Authentication (Login/Register/Logout)
- [x] **US-2, 3, 4**: Trip Planning Flow
  - [x] Plan oluşturma form ekranları (3 adım)
  - [x] Tarih seçimi (date picker)
  - [x] Bütçe girişi
  - [x] Şehir seçimi (multi-select)
  - [x] Tercihler (konaklama tipi, seyahat stili)
  - [x] Backend API endpoints (`POST /api/trips`, `GET /api/trips`)

### US-5: AI Plan Oluşturma (Sonraki Adım)
- [ ] Backend'e 3rd party API entegrasyonları
  - [ ] Flight API (Skyscanner/Kiwi)
  - [ ] Accommodation API (Booking.com)
  - [ ] Transportation API (Rome2rio/12Go)
- [ ] LLM entegrasyonu (Gemini/OpenAI)
- [ ] Plan generation logic

### US-6, 7, 8, 9: Plan Display
- [ ] Timeline UI component
- [ ] Günlük plan kartları
- [ ] Uçuş detayları görünümü
- [ ] Konaklama önerileri
- [ ] Bütçe breakdown

---

## 📞 Yardım

Sorun yaşıyorsanız:
1. Bu rehberdeki troubleshooting bölümünü kontrol edin
2. `backend/README.md` ve `mobile/README.md` dosyalarına bakın
3. Supabase Dashboard'da logs kontrol edin
4. Terminal'deki error mesajlarını inceleyin

**Başarılar!** 🚀
