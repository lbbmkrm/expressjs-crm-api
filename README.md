# CRM RESTful API

Proyek ini dibangun menggunakan Node.js, Express, dan Prisma, dengan fokus pada *clean architecture*, *security*, dan *scalability*. Proyek ini berfungsi sebagai *case study* atau portofolio yang menampilkan *best practices* dalam pengembangan aplikasi *backend*.

## Features

- **User Management**: Registrasi pengguna, otentikasi (JWT), dan *role-based access control* (Admin, Manager, Sales, Viewer).
- **Customer & Contact Management**: Operasi CRUD untuk pelanggan dan kontak terkait.
- **Sales Pipeline**:
    - **Leads**: Melacak calon pelanggan.
    - **Opportunities**: Mengelola *sales deals* dari kualifikasi hingga *closing*.
- **Task Management**: Menetapkan dan melacak *tasks* yang terkait dengan pelanggan, *leads*, atau *opportunities*.
- **Marketing Campaigns**: Merencanakan dan mengelola kampanye pemasaran.
- **Product & Sales Tracking**: Mengelola produk dan mencatat transaksi penjualan.
- **Support Tickets**: Menangani permintaan *customer support*.
- **Interactions**: Mencatat *notes* dan *activities* (panggilan, email, rapat).
- **Document Management**: Mengunggah dan mengaitkan dokumen dengan berbagai entitas.
- **Dashboard**: (Konseptual) *Endpoint* untuk mengambil data dasbor.
- **Soft Deletes**: Diimplementasikan untuk sebagian besar model untuk mencegah kehilangan data yang tidak disengaja.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **API Documentation**: OpenAPI (Swagger)
- **Testing**: Jest, Supertest
- **Logging**: Winston

## Getting Started

Ikuti instruksi ini untuk menjalankan proyek ini di komputer Anda untuk tujuan *development* dan *testing*.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- *Package manager* seperti [npm](https://www.npmjs.com/)

### Installation

1.  **Clone repository:**
    ```bash
    git clone https://github.com/your-username/crm-api.git
    cd crm-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup environment variables:**
    Buat file `.env` di *root directory* dengan menyalin file contoh:
    ```bash
    cp .env.example .env
    ```
    Perbarui file `.env` dengan *database connection string* dan *JWT secret* Anda:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="your_jwt_secret_key"
    JWT_EXPIRES_IN="1d"
    ```

4.  **Run database migrations:**
    Ini akan membuat skema *database* berdasarkan model yang didefinisikan di `prisma/schema.prisma`.
    ```bash
    npm run db:migrate
    ```

5.  **(Optional) Seed the database:**
    Untuk mengisi *database* dengan data awal untuk *testing*.
    ```bash
    npm run db:seed
    ```

### Running the Application

-   **Development mode** (dengan *hot-reloading*):
    ```bash
    npm run dev
    ```

-   **Production mode**:
    ```bash
    npm start
    ```

Server akan dimulai pada *port* yang ditentukan dalam konfigurasi Anda (default 3000 atau 8000).

### Running Tests

Untuk menjalankan *automated tests*:
```bash
npm test
```

## API Documentation

API ini didokumentasikan menggunakan spesifikasi OpenAPI 3.0. Setelah aplikasi berjalan, Anda dapat mengakses dokumentasi interaktif Swagger UI di:

**http://localhost:{PORT}/api-docs**

(Ganti `{PORT}` dengan *port* tempat aplikasi Anda berjalan).

## Project Structure

Proyek ini mengikuti *layered architecture* untuk memastikan *separation of concerns* yang bersih:

```
/
├── prisma/             # Prisma schema, migrations, and seeds
├── src/
│   ├── app.js          # Main Express application setup
│   ├── config/         # Application configuration (logger, etc.)
│   ├── controllers/    # Request/response handling logic
│   ├── middlewares/    # Express middlewares (auth, error handling, validation)
│   ├── policies/       # Authorization logic for different roles
│   ├── repositories/   # Data access layer (interacts with Prisma)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   ├── utils/          # Utility classes and functions
│   └── validators/     # Joi validation schemas
└── tests/              # Jest test files
```