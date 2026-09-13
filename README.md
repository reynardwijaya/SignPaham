# SignPaham

Platform edukasi interaktif untuk belajar **Bahasa Isyarat Indonesia (BISINDO)** — karena 2.500.000+ tunarungu di Indonesia juga ingin didengar.

## Fitur

- **Alfabet BISINDO** — 26 huruf interaktif lengkap dengan cara membentuk isyaratnya, progres belajar tersimpan otomatis
- **Latihan Tebak Kata** — pilih tingkat kesulitan & kecepatan tampilan, jawab lewat rangkaian isyarat
- **Riwayat & Skor** — lacak setiap jawaban, akurasi, dan perkembangan dari waktu ke waktu
- **Akun Pengguna** — daftar/masuk lewat panel yang cepat, tanpa pindah halaman
- **Bekerja tanpa akun** — progres tetap tersimpan lokal untuk pengguna yang belum login

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase

## Menjalankan Secara Lokal

```bash
npm install
cp .env.local.example .env.local   # isi kredensial Supabase
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Untuk setup database, struktur proyek lengkap, dan detail arsitektur, lihat **[documentation.md](documentation.md)**.

## Dibuat oleh

[Reynard Wijaya](mailto:reynardwijaya710@gmail.com)
