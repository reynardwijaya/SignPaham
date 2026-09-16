# 🤟 SignPaham

Platform edukasi interaktif untuk belajar **Bahasa Isyarat Indonesia (BISINDO)** — karena 2.500.000+ tunarungu di Indonesia juga ingin didengar.

- 🔤 **Alfabet BISINDO** — 26 huruf interaktif lengkap dengan cara membentuk isyaratnya, progres belajar tersimpan otomatis
- 🎯 **Latihan Tebak Kata** — pilih tingkat kesulitan & kecepatan tampilan, jawab lewat rangkaian isyarat
- 📊 **Riwayat & Skor** — lacak setiap jawaban, akurasi, dan perkembangan dari waktu ke waktu
- 👤 **Akun Pengguna** — daftar/masuk lewat panel slide-in yang cepat, tanpa pindah halaman
- 💾 **Bekerja tanpa akun** — progres tetap tersimpan lokal untuk pengguna yang belum login

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Animasi | Framer Motion |
| Backend / Database | Supabase (Postgres + Auth) |
| Hosting | Vercel (atau platform Node.js lain) |

## Environment Variables

Salin `.env.local.example` menjadi `.env.local` lalu isi:

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key, aman dipakai di client |
| `SUPABASE_SERVICE_ROLE_KEY` | Rahasia, server-only — dipakai untuk fitur reset password |

Semua diambil dari **Supabase Dashboard → Project Settings → API**.

## Cara Instalasi & Menjalankan

Prasyarat: Node.js 18.18+ dan akun Supabase (gratis) dengan 1 project sudah dibuat.

```bash
# 1. Clone repo
git clone https://github.com/reynardwijaya/SignPaham.git
cd SignPaham

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.local.example .env.local
# lalu isi .env.local dengan kredensial dari Supabase Dashboard

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Script tambahan:

```bash
npm run build   # build production
npm run start   # jalankan hasil build
npm run lint    # cek linting
```
