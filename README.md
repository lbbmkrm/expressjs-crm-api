# CRM RESTful API

Proyek ini dibangun menggunakan Node.js, Express, dan Prisma, dengan fokus pada arsitektur yang bersih, keamanan, dan skalabilitas. Proyek ini berfungsi sebagai studi kasus atau portofolio yang menunjukkan implementasi praktik terbaik yang saya ketahui dalam pengembangan aplikasi backend.

## Fitur Utama

- **Manajemen Pengguna & Peran**: Sistem pengguna dengan empat peran berbeda (`ADMIN`, `MANAGER`, `SALES`, `VIEWER`).
- **Otentikasi & Otorisasi**: Menggunakan JWT (JSON Web Tokens) untuk otentikasi dan sistem _Policy-Based Authorization_ untuk mengontrol akses ke setiap endpoint berdasarkan peran pengguna.
- **Sales Pipeline**: Manajemen alur penjualan penuh, mulai dari `Lead` -> `Opportunity` -> `Sale`.
- **Manajemen Pelanggan**: CRUD penuh untuk `Customers` dan `Contacts` terkait.
- **Manajemen Produk**: Kemampuan untuk mengelola produk yang dapat dijual.
- **Pelacakan Interaksi**: Mencatat `Activities` (panggilan, email, rapat) dan `Notes` yang terhubung ke pelanggan, prospek, atau peluang.
- **Manajemen Tugas**: Membuat dan menugaskan `Tasks` ke pengguna lain.
- **Manajemen Dokumen**: Mengunggah dan mengelola dokumen (`proposals`, `invoices`, `contracts`) yang terkait dengan berbagai entitas.
- **Dashboard Analitik**: Endpoint dashboard yang menyajikan data agregat yang berbeda berdasarkan peran pengguna.
- **Fitur Tambahan**: Termasuk modul untuk `Campaigns` (kampanye pemasaran) dan `Tickets` (dukungan pelanggan).

## Arsitektur

Aplikasi ini menggunakan **arsitektur berlapis (Layered Architecture)** untuk memisahkan tanggung jawab secara jelas:

- **`routes`**: Mendefinisikan semua endpoint API dan menautkannya ke middleware dan controller yang sesuai.
- **`middlewares`**: Menangani otentikasi (JWT), otorisasi (Policies), validasi input (Joi), logging, dan penanganan error.
- **`controllers`**: Menerima HTTP request, memvalidasi input dasar, dan memanggil `service` yang relevan. Bertanggung jawab untuk membentuk dan mengirim HTTP response.
- **`services`**: Berisi semua logika bisnis inti aplikasi. Mengorkestrasi data dari berbagai `repository` untuk menyelesaikan sebuah tugas.
- **`repositories`**: Satu-satunya lapisan yang berkomunikasi langsung dengan database menggunakan Prisma Client. Bertugas untuk abstraksi query database.
- **`policies`**: Mendefinisikan aturan hak akses (misalnya, "hanya ADMIN yang bisa menghapus pengguna").
- **`validators`**: Skema validasi (menggunakan Joi) untuk memastikan integritas data yang masuk.

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Testing**: Jest, Supertest
- **Validasi**: Joi
- **Keamanan**: JWT (jsonwebtoken), Bcrypt
- **Logging**: Winston
- **File Uploads**: Multer

## Prasyarat

- [Node.js](https://nodejs.org/) (v18.x atau lebih baru)
- [NPM](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

## Instalasi & Setup

1.  **Clone repositori ini:**

    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd crm-api
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Buat file `.env` di root proyek dengan menyalin dari `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Kemudian, isi variabel di dalam file `.env`:

    ```env
    # URL koneksi ke database PostgreSQL Anda
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # Secret key untuk menandatangani JWT
    JWT_SECRET="SECRET_KEY_ANDA_YANG_KUAT"

    # Port untuk menjalankan server
    PORT=3000
    ```

4.  **Jalankan Migrasi Database:**
    Perintah ini akan membuat tabel-tabel di database Anda sesuai dengan `schema.prisma`.

    ```bash
    npx prisma migrate dev
    ```

5.  **(Opsional) Seed Database:**
    Isi database dengan data awal (termasuk user ADMIN, MANAGER, dll.) untuk mempermudah pengujian.
    ```bash
    npm run db:seed
    ```

## Menjalankan Aplikasi

- **Mode Development (dengan hot-reload):**

  ```bash
  npm run dev
  ```

  Server akan berjalan di `http://localhost:3000`.

- **Mode Production:**
  ```bash
  npm run start
  ```

## Menjalankan Test

Untuk menjalankan semua test suite menggunakan Jest:

```bash
npm test
```

## Endpoint API

API ini menyediakan endpoint RESTful yang kaya untuk semua fiturnya. Berikut adalah beberapa contoh endpoint utama:

- `POST /api/auth/register` - Registrasi pengguna baru.
- `POST /api/auth/login` - Login dan dapatkan token JWT.
- `GET /api/dashboard` - Mendapatkan data dashboard sesuai peran pengguna.
- `GET, POST /api/customers` - Mendapatkan daftar atau membuat customer baru.
- `GET, PATCH, DELETE /api/customers/:id` - Mengelola customer spesifik.
- `POST /api/leads` - Membuat lead baru.
- `POST /api/leads/:id/convert` - Mengonversi lead menjadi customer, contact, dan opportunity.
- `GET, POST /api/opportunities` - Mendapatkan atau membuat opportunity baru.
- `POST /api/sales` - Membuat data penjualan baru.
- `POST /api/documents` - Mengunggah dokumen.

Sebagian besar endpoint memerlukan otentikasi melalui Bearer Token. Silakan merujuk ke direktori `src/routes` untuk daftar lengkap semua endpoint dan metode HTTP yang didukung.
