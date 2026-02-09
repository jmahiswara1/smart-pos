# SmartPOS Frontend

Ini adalah bagian frontend dari aplikasi SmartPOS, dibangun menggunakan React, TypeScript, dan Vite. Aplikasi ini menyediakan antarmuka pengguna yang responsif dan modern untuk manajemen kasir (POS) dan dashboard analitik.

## Fitur Frontend

-   **Dashboard Interaktif**: Visualisasi data penjualan dengan grafik Recharts.
-   **POS Terminal**: Antarmuka kasir yang dioptimalkan untuk kecepatan transaksi.
-   **Manajemen Inventaris**: Tabel produk dengan fitur pencarian, filter, dan pagination server-side.
-   **Desain Responsif**: Tampilan yang menyesuaikan dengan perangkat desktop dan tablet.

## Teknologi Utama

-   **React 18**: Library UI utama.
-   **Vite**: Build tool yang cepat.
-   **TypeScript**: Bahasa pemrograman untuk keamanan tipe data.
-   **Tailwind CSS**: Framework CSS utility-first untuk styling.
-   **TanStack Query (React Query)**: Manajemen state server dan caching data.
-   **Zustand**: Manajemen state global yang ringan (untuk cart belanja).
-   **React Hook Form & Zod**: Penanganan form dan validasi skema.
-   **Lucide React**: Koleksi ikon yang konsisten.

## Prasyarat

Pastikan Anda telah menginstal:
-   Node.js (versi 18 atau lebih baru)
-   npm (biasanya disertakan dengan Node.js)

## Cara Menjalankan

1.  **Masuk ke direktori frontend**
    ```bash
    cd frontend
    ```

2.  **Instal dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan**
    ```bash
    npm run dev
    ```

4.  **Buka aplikasi**
    Akses `http://localhost:5173` di browser Anda.

## Struktur Folder

-   `src/components`: Komponen UI yang dapat digukanan kembali (Button, Input, Card, dll).
-   `src/features`: Fitur spesifik seperti POS (Cart, ProductGrid).
-   `src/pages`: Halaman utama aplikasi (Dashboard, Products, POS, dll).
-   `src/hooks`: Custom hooks React.
-   `src/lib`: Utilitas dan konfigurasi (axios, utils).
-   `src/types`: Definisi tipe TypeScript global.

## Konfigurasi

Frontend dikonfigurasi untuk terhubung ke backend pada `http://localhost:3000/api`. Jika Anda mengubah port backend, pastikan untuk menyesuaikan konfigurasi `baseURL` di `src/lib/axios.ts`.

## Script Tersedia

-   `npm run dev`: Menjalankan aplikasi dalam mode pengembangan.
-   `npm run build`: Membangun aplikasi untuk produksi.
-   `npm run preview`: Meninjau hasil build produksi secara lokal.
-   `npm run lint`: Memeriksa kode untuk kesalahan linting.
