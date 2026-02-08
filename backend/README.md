# SmartPOS Backend

Backend API untuk SmartPOS, dibangun menggunakan NestJS, Prisma, dan PostgreSQL. Menyediakan layanan RESTful API untuk manajemen produk, transaksi, pelanggan, dan otentikasi.

## Prasyarat

-   Node.js (versi 18 atau lebih baru)
-   PostgreSQL (basis data)
-   npm (manajer paket)

## Instalasi

1.  **Masuk ke direktori backend**
    ```bash
    cd backend
    ```

2.  **Instal dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya.
    ```bash
    cp .env.example .env
    ```
    Pastikan `DATABASE_URL` telah diisi sesuai dengan kredensial PostgreSQL Anda (lokal atau cloud).

4.  **Migrasi Database**
    Jalankan migrasi untuk membuat tabel di database.
    ```bash
    npx prisma migrate dev
    ```

5.  **Seed Database (Opsional)**
    Isi database dengan data awal (pengguna admin default).
    ```bash
    npx prisma db seed
    ```

## Menjalankan Aplikasi

**Mode Pengembangan**
```bash
npm run start:dev
```
Server akan berjalan di `http://localhost:3000`.

**Mode Produksi**
```bash
npm run build
npm run start:prod
```

## Dokumentasi API

Aplikasi ini dilengkapi dengan dokumentasi Swagger (OpenAPI).
Setelah server berjalan, buka browser dan akses:
`http://localhost:3000/api`

## Akun Default

Jika Anda menjalankan seed database, akun berikut akan dibuat:

-   **Email**: admin@gmail.com
-   **Password**: admin123

## Struktur Project

-   `src/modules`: Modul fitur (Auth, Users, Products, Categories, Transactions, Customers).
-   `src/common`: Decorators, Guards, dan Interceptors yang digunakan global.
-   `src/prisma`: Layanan koneksi database Prisma.
-   `prisma/schema.prisma`: Skema database.

## Variabel Lingkungan

Pastikan variabel berikut dikonfigurasi di file `.env`:

| Variabel | Deskripsi | Default |
|----------|-----------|---------|
| `DATABASE_URL` | String koneksi PostgreSQL | - |
| `JWT_SECRET` | Kunci rahasia untuk token JWT | - |
| `JWT_EXPIRES_IN` | Masa berlaku token | 7d |
| `PORT` | Port server aplikasi | 3000 |
| `CORS_ORIGIN` | Origin yang diizinkan untuk CORS | http://localhost:5173 |

## Lisensi

MIT
