# Supabase Kurulum Rehberi

## Adım 1: Supabase Projesi Oluşturma

1. [supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuna tıklayın (veya giriş yapın)
3. "New Project" butonuna tıklayın
4. Proje bilgilerini girin:
   - **Name**: TravelAsist-AI (veya istediğiniz isim)
   - **Database Password**: Güçlü bir şifre belirleyin (NOT ALIN!)
   - **Region**: En yakın bölgeyi seçin (örn: Europe West)
5. "Create new project" butonuna tıklayın (2-3 dakika sürebilir)

## Adım 2: API Credentials Alma

Proje oluşturulduktan sonra:

1. Sol menüden **Settings (Ayarlar)** > **API** sekmesine gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**: `https://xxxxx.supabase.co` formatında
   - **anon/public key**: `eyJ...` ile başlayan uzun token
   - **service_role key**: `eyJ...` ile başlayan başka bir token (GİZLİ TUTUN!)

## Adım 3: Environment Variables

Backend projesi için `.env` dosyası oluşturacağız. Yukarıdaki bilgileri hazır tutun.

## Adım 4: Database Şeması Kurulumu

1. Supabase Dashboard'da sol menüden **SQL Editor** sekmesine gidin
2. "New query" butonuna tıklayın
3. `docs/database-schema.sql` dosyasındaki SQL kodlarını yapıştırın (bu dosyayı ben oluşturacağım)
4. **RUN** butonuna tıklayın

## Adım 5: Email Auth Ayarları (Opsiyonel - Geliştirme İçin)

Geliştirme sırasında email doğrulamasını devre dışı bırakabilirsiniz:

1. Sol menüden **Authentication** > **Providers** sekmesine gidin
2. **Email** provider'ına tıklayın
3. **Confirm email** seçeneğini kapatın (geliştirme için)
4. **Save** butonuna tıklayın

## Hazır!

Yukarıdaki adımları tamamladıktan sonra bana şu bilgileri verin:
- ✅ Project URL
- ✅ Anon Key
- ✅ Service Role Key

Ben bunları `.env` dosyasına ekleyeceğim.
