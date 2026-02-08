# SmartPOS - Sistem Kasir Pintar

SmartPOS adalah aplikasi Point of Sale (POS) modern yang dirancang untuk membantu pengelolaan transaksi penjualan, inventaris produk, pelanggan, dan pelaporan keuangan secara real-time. Aplikasi ini dibangun dengan teknologi web terkini untuk memastikan performa yang cepat dan antarmuka yang responsif.

## Fitur Utama

-   **Dashboard Analitik**: Ringkasan performa bisnis secara real-time (pendapatan, keuntungan, total transaksi).
-   **Manajemen Produk**: Tambah, edit, hapus, dan pantau stok produk dengan mudah.
-   **Kasir (POS)**: Antarmuka kasir yang intuitif dengan dukungan barcode scanner dan pencarian cepat.
-   **Manajemen Pelanggan**: Simpan data pelanggan dan riwayat belanja mereka.
-   **Laporan Transaksi**: Pantau riwayat transaksi lengkap dengan filter dan pencarian.
-   **Kategori Produk**: Pengelompokan produk untuk organisasi yang lebih baik.

## Desain Database

Aplikasi ini menggunakan PostgreSQL sebagai database relational utama. Skema database dirancang untuk integritas data dan performa tinggi.

### Skema Relasi (ERD)

Database terdiri dari tabel-tabel utama berikut:

-   **User**: Menyimpan data pengguna (admin/staff) untuk otentikasi.
    -   `id`, `email`, `passwordHash`, `role` (admin, manager, staff).
-   **Product**: Menyimpan informasi detail produk.
    -   `id`, `name`, `sku`, `price`, `stock`, `categoryId`.
-   **Category**: Mengelompokkan produk.
    -   `id`, `name`, `icon`, `color`.
-   **Customer**: Menyimpan data pelanggan.
    -   `id`, `name`, `phone`, `totalPurchases`.
-   **Transaction**: Mencatat header transaksi.
    -   `id`, `transactionNumber`, `total`, `paymentMethod`, `paymentStatus`.
-   **TransactionItem**: Mencatat detail item dalam setiap transaksi.
    -   `id`, `transactionId`, `productId`, `quantity`, `subtotal`.

*Relasi:*
-   `Category` one-to-many `Product`
-   `Transaction` one-to-many `TransactionItem`
-   `User` one-to-many `Transaction`
-   `Customer` one-to-many `Transaction`

## Tampilan Aplikasi

-   **Database**: ![Database Screenshot](/screenshots/database.png)
-   **Login**: ![Login Screenshot](/screenshots/login.png)
-   **Dashboard**: ![Dashboard Screenshot](/screenshots/dashboard.png)
-   **POS Terminal**: ![POS Screenshot](/screenshots/pos.png)
-   **Manajemen Produk**: ![Products Screenshot](/screenshots/products.png)
-   **Manajemen Pelanggan**: ![Customers Screenshot](/screenshots/customers.png)
-   **Laporan Transaksi**: ![Transactions Screenshot](/screenshots/transactions.png)
-   **Manajemen Kategori**: ![Categories Screenshot](/screenshots/categories.png)
-   **Profile**: ![Profile Screenshot](/screenshots/profile.png)

## Teknologi dan Dependensi

Project ini dibangun menggunakan stack modern:

### Frontend
-   **Framework**: React (Vite)
-   **Bahasa**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand, React Query (TanStack Query)
-   **Komponen UI**: Headless UI, Lucide React (Ikon)
-   **Visualisasi Data**: Recharts
-   **Form & Validasi**: React Hook Form, Zod

### Backend
-   **Framework**: NestJS
-   **Bahasa**: TypeScript
-   **Database ORM**: Prisma
-   **Database**: PostgreSQL
-   **Dokumentasi API**: Swagger (OpenAPI)

## Cara Menjalankan Project

### Prasyarat
-   Node.js (v18+)
-   PostgreSQL

### Instalasi dan Setup

1.  **Clone Repository**
    ```bash
    git clone https://github.com/jmahiswara1/smart-pos.git
    cd smart-pos
    ```

2.  **Konfigurasi Database**

    Anda dapat menggunakan PostgreSQL lokal atau layanan cloud seperti Supabase.
    
    *Buat file `.env` di dalam folder `backend`.*

    **Opsi A: PostgreSQL Lokal**
    -   Pastikan PostgreSQL sudah terinstall dan service berjalan.
    -   Buat database baru (contoh: `smart_pos`).
    -   Isi `.env`:
        ```env
        DATABASE_URL="postgresql://postgres.[username]:[password]@localhost:5432/smart_pos?schema=public"
        ```
    
    **Opsi B: Supabase (Cloud)**
    -   Buat project baru di [Supabase](https://supabase.com/).
    -   Masuk ke **Project Settings > Database > Connection pooling**.
    -   Salin *Connection String* (Mode: Transaction) dan isi ke `.env`:
        ```env
        DATABASE_URL="postgres://postgres.xxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        ```

3.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Buat file .env sesuai contoh .env.example
    # Pastikan koneksi database benar
    npx prisma migrate dev
    npm run start:dev
    ```

4.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  **Akses Aplikasi**
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:3000/api`
    -   API Docs: `http://localhost:3000/api`

## Catatan Pengembang

-   **Struktur Folder**: Project ini menggunakan struktur monorepo sederhana dengan folder `frontend` dan `backend` terpisah.
-   **Autentikasi**: Menggunakan JWT (JSON Web Tokens). Token disimpan di local storage pada frontend.
-   **Format Keuangan**: Semua nilai mata uang diformat menggunakan `Intl.NumberFormat` untuk Rupiah (IDR).

## Dokumentasi Postman

> **[Lihat Dokumentasi Postman Lengkap](https://documenter.getpostman.com/view/50579029/2sBXc8qPpk)**

## Kontak

-   **Email**: gadangjatumahiswara@gmail.com
-   **Instagram**: @j.mahiswara_
-   **Portfolio**: https://gadangmahiswara.vercel.app

