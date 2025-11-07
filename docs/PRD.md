🚀 PRD: Akıllı Seyahat Asistanı Projesi
Doküman Sürümü: 1.0 Tarih: 7 Kasım 2025 Proje Sahibi: (Sen) Teknik Liderlik: (Gemini & Sen)

1. Özet ve Vizyon
   Proje Adı: Gezgin Asistan (Çalışma Adı)

Vizyon: Seyahat planlamayı, birden fazla web sitesi (uçuş, otel, harita, forum) arasında kaybolan kullanıcılar için tek bir platformda toplayan, yapay zeka destekli, kişiselleştirilmiş bir seyahat planlama asistanı oluşturmak.

Problem: Kullanıcılar, özellikle çok şehirli ve bütçe kısıtlı seyahatleri planlarken en uygun uçuşu bulmak, şehirler arası rotayı optimize etmek, bütçelerine uygun konaklama aramak ve tüm bunları mantıklı bir zaman çizelgesine oturtmak için saatler harcıyor.

Çözüm: Kullanıcının Tarih Aralığı, Toplam Bütçe, Gidilecek Ülke ve İlgilendiği Şehirler gibi temel girdilerini alıp; uçuş, konaklama ve yerel ulaşım verilerini anlık olarak çeken ve yapay zeka kullanarak bu verileri en optimize, gün-gün plana dönüştüren bir mobil/web uygulaması.

2. Hedef Kitle
   Birincil: 18-35 yaş arası, bütçeye duyarlı (backpackers, öğrenciler, genç profesyoneller) ve teknolojiyi aktif kullanan gezginler.

İkincil: Planlama karmaşasından bunalan ve "Bana sadece ne yapacağımı söyle" diyen, zamanı kısıtlı olan herkes.

3. Temel Akış ve Kullanıcı Hikayeleri (User Stories)
   Kullanıcının Tayland örneği üzerinden (15-25 Ocak, TR -> Tayland) temel akışı:

US-1 (Kimlik Doğrulama): Bir kullanıcı olarak, hesabımı (email/Google ile) oluşturabilmeli ve giriş yapabilmeliyim ki planlarımı kaydedebileyim.

US-2 (Ana Plan Girişi): Bir kullanıcı olarak, ana sayfada "Yeni Plan" butonuna tıkladıktan sonra Nereden (Türkiye), Nereye (Tayland), Gidiş Tarihi (15 Ocak 2026), Dönüş Tarihi (25 Ocak 2026) ve Toplam Bütçem (örn: 1500$) bilgilerini girebilmeliyim.

US-3 (Detaylandırma - Şehirler): Bir kullanıcı olarak, bir sonraki ekranda (veya aynı ekranda açılan bir alanda) Tayland içinde ilgilendiğim şehirleri (örn: Bangkok, Phuket, Pattaya) seçebilmeliyim.

US-4 (Detaylandırma - Tercihler): Bir kullanıcı olarak, konaklama tercihimi (Hostel / Otel / Daire) ve seyahat stilimi (Hızlı / Yavaş / Macera) belirtebilmeliyim.

US-5 (Plan Oluşturma): Bir kullanıcı olarak, "Planımı Oluştur" butonuna bastığımda, sistemin benim için en iyi planı aradığını belirten bir yükleme ekranı görmeliyim.

US-6 (Plan Görüntüleme - Ana Hatlar): Bir kullanıcı olarak, oluşturulan planda önce en ucuz uluslararası uçuş seçeneğini (Fiyatı, Havayolu) görmeliyim.

US-7 (Plan Görüntüleme - Günlük Plan): Bir kullanıcı olarak, sistemin benim için oluşturduğu optimize edilmiş rotayı (örn: 2 gün Bangkok, 1 gün Pattaya, 3 gün Phuket...) gün-gün ayrılmış bir zaman çizelgesinde (timeline) görmeliyim.

US-8 (Plan Görüntüleme - Detaylar): Bir kullanıcı olarak, her bir gün için önerilen konaklama (isim, fiyat, tip) ve şehirler arası ulaşım (örn: Bangkok -> Pattaya, Otobüs, 2 saat, 5$) detaylarını görmeliyim.

US-9 (Plan Görüntüleme - Bütçe): Bir kullanıcı olarak, planın en üstünde veya altında Toplam Tahmini Maliyeti (Uçuş + Konaklama + Ara Ulaşım) ve benim belirlediğim bütçeye göre durumumu (örn: "Bütçenizin 50$ altındasınız") görmeliyim.

US-10 (Alternatifler): Bir kullanıcı olarak, önerilen oteli beğenmezsem "Alternatifleri Gör" diyerek o şehir ve bütçe için diğer seçenekleri görebilmeliyim.

4. Teknik Gereksinimler ve Mimari
   A. Teknoloji Yığını (Kararlaştırılan)
   Frontend (Mobil & Web): React Native (Expo ile) + react-native-web

Backend: Node.js (Express.js)

Veritabanı & Auth: Supabase (PostgreSQL + Auth)

AI Modeli: LLM API (Gemini / OpenAI - Maliyet ve hız optimizasyonu için Gemini tercih edilebilir)

B. 3. Parti API'ler (Hayat Damarları)
Uçuş API'si (Özellik 1): Skyscanner (RapidAPI) veya Kiwi (Tequila API).

Konaklama API'si (Özellik 5): Booking.com (RapidAPI) veya Hostelworld API.

Ulaşım API'si (Özellik 6): Rome2rio API veya 12Go Asia API (Tayland örneği için 12Go çok güçlüdür, şehirler arası otobüs/tren/feribot için).

C. Backend Mimarisi (Node.js/Express)
/auth Rotaları:

POST /auth/register: Supabase'e kayıt.

POST /auth/login: Supabase'den token alma.

/trips Rotaları (CRUD):

POST /trips: Yeni bir planlama talebi oluşturur (US-2, 3, 4'teki verileri alır), bunu DB'ye kaydeder ve AI Planlama sürecini tetikler.

GET /trips/:id: Oluşturulan planın detaylarını getirir (US-6, 7, 8).

GET /trips/user/:userId: Kullanıcının tüm geçmiş planlarını listeler.

/planner-service (AI Beyni - Asenkron olabilir):

Bu servis POST /trips tarafından tetiklenir.

Adım 1: Gelen isteğe göre 3. parti API'lere paralel istekler atar (Uçuş, Otel Listeleri, Ara Ulaşım Seçenekleri).

Adım 2: Tüm bu ham JSON verilerini toplar.

Adım 3: Bu verileri ve kullanıcı tercihlerini (bütçe, şehirler) dev bir "Master Prompt" içine yerleştirir.

Adım 4: LLM API'ye bu prompt'u gönderir ve spesifik bir JSON formatında (günlük plan) çıktı ister.

Adım 5: Gelen optimize edilmiş JSON planını Supabase'deki generated_plans tablosuna kaydeder.

D. Veritabanı Şeması (Supabase/PostgreSQL)
users (Supabase Auth tarafından yönetilir)

profiles

id (PK, users.id'ye FK)

username (string)

trip_requests (Kullanıcının ne istediği)

id (PK)

user_id (FK to users.id)

origin (string, örn: "TURKEY")

destination (string, örn: "THAILAND")

start_date (date)

end_date (date)

budget (int)

requested_cities (text[])

accommodation_preference (string, "hostel" / "otel" / "farketmez")

status (string, "pending" / "completed" / "failed")

generated_plans (AI'ın ne ürettiği)

id (PK)

request_id (FK to trip_requests.id)

total_estimated_cost (int)

plan_data (jsonb) <- Tüm sihir burada. AI'dan gelen gün-gün plan JSON'u burada saklanır.

international_flight_details (jsonb)

5. MVP (Minimum Uygulanabilir Ürün) Kapsamı
   Başlangıçta her şeyi mükemmel yapmak yerine, temel değeri sunan çekirdek ürüne (MVP) odaklanmalıyız.

MVP'ye DAHİL OLANLAR:

Email/Şifre ile kayıt ve giriş (Supabase Auth).

Yeni plan oluşturma akışı (US-2, US-3, US-4).

Tek bir ülke için planlama (örn: Sadece Tayland ile başlarız).

AI'ın planı oluşturması (US-5).

Oluşturulan planın sadece okunabilir (read-only) bir zaman çizelgesinde gösterilmesi (US-6, 7, 8, 9).

Temel 3 API entegrasyonu (Uçuş, Konaklama, Ara Ulaşım).

MVP KAPSAMI DIŞINDA OLANLAR (V2.0 için):

Doğrudan Rezervasyon: Uygulama içinden uçak/otel satın alma. (Bu, yasal ve ticari olarak çok büyük bir adımdır. V1'de sadece link veririz).

Plan Düzenleme: AI'ın oluşturduğu planı sürükle-bırak ile değiştirme.

Aktivite/Tur Önerileri: (Örn: "Bangkok'ta Grand Palace'ı ziyaret et"). V1 sadece lojistiğe odaklanmalı.

Çoklu Ülke Planlama: (Örn: "Tayland-Vietnam-Kamboçya Turu").

Google/Apple ile Sosyal Giriş: (Hızlıca eklenebilir ama MVP için şart değil).
