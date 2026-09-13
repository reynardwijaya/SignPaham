# SignPaham — Dokumentasi Proyek

Platform edukasi interaktif untuk belajar **Bahasa Isyarat Indonesia (BISINDO)** — alfabet, latihan tebak kata, tracking progres, dan akun pengguna.

---

## 1. Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 (konfigurasi via `@theme` di `globals.css`, **bukan** `tailwind.config.ts`) |
| Animasi | Framer Motion |
| Ikon | lucide-react |
| Backend / Database | Supabase (Postgres + Auth) |
| Hosting target | Vercel (atau platform Node.js lain) |

> **Catatan penting soal Tailwind v4:** versi ini tidak lagi membaca `tailwind.config.ts` secara otomatis. Semua warna, font, dan radius kustom didefinisikan lewat blok `@theme { ... }` di `src/app/globals.css`. Kalau mau menambah warna/token baru, edit file itu — bukan bikin `tailwind.config.ts`.

---

## 2. Struktur Folder & Kegunaannya

```
SignPaham/
├── src/
│   ├── app/                     # Routing Next.js App Router (tiap folder = 1 URL)
│   │   ├── page.tsx             # Halaman Beranda ("/")
│   │   ├── layout.tsx           # Root layout: font, AuthProvider, ToastProvider, AuthModalProvider, OfflineOverlay
│   │   ├── globals.css          # Design tokens Tailwind v4 (@theme), style dasar
│   │   ├── error.tsx            # Error boundary bawaan Next.js (halaman error 500-ish)
│   │   ├── global-error.tsx     # Error boundary paling luar (self-contained, tanpa dependency layout)
│   │   ├── not-found.tsx        # Halaman 404
│   │   ├── icon.png / apple-icon.png  # Favicon & apple touch icon (konvensi App Router)
│   │   ├── alfabet/page.tsx     # Halaman "/alfabet" — grid 26 huruf BISINDO
│   │   ├── latihan/page.tsx     # Halaman "/latihan" — setup & quiz tebak kata
│   │   ├── segera-hadir/page.tsx# Halaman placeholder "under development" (bisa dipakai untuk fitur belum jadi)
│   │   └── api/
│   │       └── reset-password-direct/route.ts  # API route server-side (pakai service_role key)
│   │
│   ├── components/
│   │   ├── layout/               # Navbar & Footer — dipakai di semua halaman
│   │   ├── auth/                 # AuthPanel — panel slide-in Login/Register/Lupa Password
│   │   ├── alfabet/               # AlfabetGrid, HurufModal (detail + navigasi), CelebrationModal (confetti saat 26/26 selesai)
│   │   ├── latihan/               # KesulitanSelector, KecepatanSelector, QuizPlayer, HistoryModal
│   │   └── ui/                    # Komponen generik: Button, PillCard, ErrorState, ConfirmModal,
│   │                               #   OfflineOverlay, HurufImage
│   │
│   ├── contexts/                 # React Context — state global via Provider
│   │   ├── AuthContext.tsx        # Sesi user Supabase: login, register, logout, reset password
│   │   ├── AuthModalContext.tsx   # Global trigger untuk panel Auth (openAuth) — bisa dipanggil dari
│   │   │                          #   halaman manapun (mis. tombol "Daftar" di Latihan), bukan cuma Navbar
│   │   └── ToastContext.tsx       # Notifikasi toast (showToast) yang bisa dipanggil dari mana saja
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useQuizEngine.ts       # Logika permainan tebak kata (state mesin kuis)
│   │   ├── useQuizHistory.ts      # Riwayat jawaban — ke Supabase kalau login, localStorage kalau tidak
│   │   └── useViewedHuruf.ts      # Progress huruf yang sudah dibuka (hybrid Supabase/localStorage) + resetProgress()
│   │
│   ├── data/                     # Data statis (bukan dari database)
│   │   ├── alfabet.ts             # 26 huruf + deskripsi cara membentuk isyaratnya
│   │   └── kosakata.ts            # Daftar kata untuk latihan, dikelompokkan per tingkat kesulitan
│   │
│   └── lib/                      # Utilitas & klien pihak ketiga
│       ├── supabase.ts            # Klien Supabase sisi browser (pakai anon key, aman di client)
│       └── supabaseAdmin.ts       # Klien Supabase sisi server (pakai service_role key — JANGAN pernah
│                                   #   di-import dari komponen "use client")
│
├── public/
│   └── isyarat/                   # Foto asli 26 huruf BISINDO (a.jpg–z.jpg, rasio 3:4), dipakai di
│                                   #   AlfabetGrid, HurufModal, dan QuizPlayer lewat HurufImage
│                                   # + logo.png, hero-bg.jpg, mascot.png, road-path.png, manifest.json
├── supabase/
│   └── schema.sql                # Skema database lengkap — dijalankan manual di Supabase SQL Editor
├── .env.local                    # Kredensial Supabase (TIDAK di-commit, ada di .gitignore)
├── .env.local.example            # Template — isi variabel apa saja yang dibutuhkan
└── documentation.md              # File ini
```

### Kenapa dipisah begini?
- **`components/` per domain** (alfabet, latihan, auth, layout, ui) — supaya gampang cari komponen mana untuk fitur mana, bukan satu folder besar berisi puluhan file campur aduk.
- **`contexts/` vs `hooks/`** — Context untuk state yang perlu dibagi ke banyak komponen sekaligus (auth, toast). Hook untuk logika yang dipakai satu alur fitur (mesin kuis, riwayat).
- **`lib/supabase.ts` vs `lib/supabaseAdmin.ts`** — dipisah tegas karena `supabaseAdmin` punya akses penuh ke database (bypass semua Row Level Security). Kalau digabung dalam satu file, risiko besar service_role key ke-bundle ke kode client.

---

## 3. Database (Supabase)

Skema lengkap ada di [`supabase/schema.sql`](supabase/schema.sql). Tiga tabel:

### `profiles`
Menyimpan nama depan/belakang user (data tambahan di luar apa yang Supabase Auth simpan bawaan). Terisi otomatis lewat **trigger** `handle_new_user` setiap kali ada user baru daftar di `auth.users`.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | Sama dengan `auth.users.id` |
| `first_name` | text | |
| `last_name` | text | |
| `created_at` | timestamptz | |

### `quiz_history`
Satu baris = satu kata yang dijawab di halaman Latihan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK → auth.users) | |
| `word` | text | Kata yang ditebak |
| `kesulitan` | text | `mudah` \| `sedang` \| `sulit` |
| `kecepatan` | text | `lambat` \| `cepat` |
| `correct` | boolean | |
| `user_answer` | text | |
| `created_at` | timestamptz | |

### `huruf_progress`
Menandai huruf apa saja yang sudah pernah dibuka user di halaman Alfabet.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `user_id` | uuid (FK) | |
| `huruf` | text | |
| `viewed_at` | timestamptz | |
| _(PK gabungan `user_id + huruf`)_ | | |

### Row Level Security (RLS)
Semua tabel di atas mengaktifkan RLS dengan policy: **user cuma bisa baca/tulis barisnya sendiri** (`auth.uid() = user_id`). Ini artinya biarpun `anon key` dipakai di client, orang lain tidak bisa mengintip atau mengubah data user lain lewat query langsung ke Supabase.

### Perilaku hybrid (penting)
`useQuizHistory` dan `useViewedHuruf` otomatis pakai Supabase kalau user sedang login, dan **fallback ke `localStorage`** kalau belum login (guest mode). Jadi fitur tetap jalan tanpa akun, tapi progresnya baru "permanen ke akun" setelah user daftar/login.

---

## 4. Environment Variables

Lihat [`.env.local.example`](.env.local.example). Salin jadi `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # aman dipakai di client, dilindungi RLS
SUPABASE_SERVICE_ROLE_KEY=              # RAHASIA — server-only, jangan pernah pakai prefix NEXT_PUBLIC_
```

Ambil ketiganya dari **Supabase Dashboard → Project Settings → API**.

`SUPABASE_SERVICE_ROLE_KEY` cuma dipakai oleh `src/app/api/reset-password-direct/route.ts` (fitur reset password tanpa email — lihat catatan keamanan di dalam file itu) dan `src/lib/supabaseAdmin.ts`.

---

## 5. Cara Instalasi & Menjalankan

### Prasyarat
- Node.js 18.18+ (disarankan versi LTS terbaru)
- Akun Supabase (gratis) dengan 1 project sudah dibuat

### Langkah-langkah

```bash
# 1. Clone repo
git clone https://github.com/reynardwijaya/SignPaham.git
cd SignPaham

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.local.example .env.local
# lalu isi .env.local dengan kredensial dari Supabase Dashboard

# 4. Setup database
# Buka Supabase Dashboard -> SQL Editor -> New query
# Paste seluruh isi supabase/schema.sql -> Run

# 5. Pastikan Auth Provider Email aktif
# Supabase Dashboard -> Authentication -> Providers -> Email -> Enable
# (juga nyalakan "Allow new users to sign up" di Authentication -> Sign In / Providers)

# 6. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Script lain

```bash
npm run build   # build production
npm run start   # jalankan hasil build
npm run lint    # cek linting
```

---

## 6. Alur Fitur Utama (Ringkas)

- **Auth** — Panel slide-in dari kanan (`AuthPanel`), bukan halaman terpisah. Mode: Masuk, Daftar, Lupa Kata Sandi (reset langsung tanpa email — lihat catatan keamanan di `route.ts`). Panel ini dikontrol lewat `AuthModalContext`, jadi tombol "Daftar"/"Masuk" di halaman manapun (Navbar, CTA tamu di Latihan, dll) bisa memicunya tanpa prop-drilling.
- **Alfabet** — Klik huruf di grid (foto asli, bukan placeholder) → modal detail muncul dengan foto, deskripsi, navigasi prev/next + keyboard arrow, dan tombol "Coba di Latihan". Progress otomatis tersimpan (Supabase/localStorage); saat 26/26 huruf selesai, `CelebrationModal` (confetti) muncul sekali. Progress bisa direset lewat tombol di sebelah progress bar (dengan `ConfirmModal`).
- **Latihan** — Pilih tingkat kesulitan & kecepatan → mesin kuis (`useQuizEngine`) menampilkan huruf demi huruf → user tebak kata → hasil masuk ke Riwayat (`HistoryModal`, cuma muncul kalau sudah login). User tamu (belum login) melihat banner ajakan daftar di atas form setup.
- **Notifikasi** — Toast (`useToast`) untuk feedback aksi (berhasil daftar/masuk/keluar/reset progres), `ConfirmModal` untuk aksi yang perlu konfirmasi (keluar akun, reset progres).
- **Error handling** — `ErrorState` (komponen reusable) dipakai di halaman 404, error boundary, dan "segera hadir"; `OfflineOverlay` otomatis muncul saat koneksi internet putus.
