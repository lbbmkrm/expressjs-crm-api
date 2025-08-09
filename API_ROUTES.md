# Daftar Endpoint API CRM

Dokumen ini merinci semua endpoint yang tersedia di aplikasi CRM.

## Otentikasi (`/api/auth`)

- `POST /register`: Mendaftarkan pengguna baru.
- `POST /login`: Login pengguna dan mendapatkan token.

## Pengguna (`/api/users`)

- `GET /`: Mendapatkan semua pengguna (hanya Admin).
- `POST /`: Membuat pengguna baru (hanya Admin).
- `GET /:id`: Mendapatkan detail pengguna berdasarkan ID.
- `PATCH /:id`: Memperbarui pengguna berdasarkan ID.
- `DELETE /:id`: Menghapus pengguna berdasarkan ID (hanya Admin).

## Pelanggan (`/api/customers`)

- `GET /`: Mendapatkan semua pelanggan.
- `POST /`: Membuat pelanggan baru.
- `GET /:id`: Mendapatkan detail pelanggan berdasarkan ID.
- `PATCH /:id`: Memperbarui pelanggan berdasarkan ID.
- `DELETE /:id`: Menghapus pelanggan berdasarkan ID.
- `GET /:id/contacts`: Mendapatkan semua kontak yang terkait dengan pelanggan.
- `GET /:id/leads`: Mendapatkan semua lead yang terkait dengan pelanggan.
- `GET /:id/opportunities`: Mendapatkan semua peluang yang terkait dengan pelanggan.
- `GET /:id/sales`: Mendapatkan semua penjualan yang terkait dengan pelanggan.
- `GET /:id/activities`: Mendapatkan semua aktivitas yang terkait dengan pelanggan.

## Kontak (`/api/contacts`)

- `GET /`: Mendapatkan semua kontak.
- `POST /`: Membuat kontak baru.
- `GET /:id`: Mendapatkan detail kontak berdasarkan ID.
- `PATCH /:id`: Memperbarui kontak berdasarkan ID.
- `DELETE /:id`: Menghapus kontak berdasarkan ID.
- `GET /:id/activities`: Mendapatkan semua aktivitas yang terkait dengan kontak.
- `GET /:id/notes`: Mendapatkan semua catatan yang terkait dengan kontak.

## Lead (`/api/leads`)

- `GET /`: Mendapatkan semua lead. Dapat difilter berdasarkan status (`?status=...`).
- `POST /`: Membuat lead baru.
- `GET /:id`: Mendapatkan detail lead berdasarkan ID.
- `PATCH /:id`: Memperbarui lead berdasarkan ID.
- `DELETE /:id`: Menghapus lead berdasarkan ID.
- `POST /:id/convert`: Mengonversi lead menjadi pelanggan, kontak, dan peluang.
- `GET /:id/opportunities`: Mendapatkan peluang yang terkait dengan lead.
- `GET /:id/activities`: Mendapatkan semua aktivitas yang terkait dengan lead.
- `GET /:id/notes`: Mendapatkan semua catatan yang terkait dengan lead.

## Peluang (`/api/opportunities`)

- `GET /`: Mendapatkan semua peluang. Dapat difilter berdasarkan tahap (`?stage=...`).
- `POST /`: Membuat peluang baru.
- `GET /:id`: Mendapatkan detail peluang berdasarkan ID.
- `PATCH /:id`: Memperbarui peluang berdasarkan ID.
- `DELETE /:id`: Menghapus peluang berdasarkan ID.
- `GET /:id/sales`: Mendapatkan semua penjualan yang terkait dengan peluang.
- `GET /:id/activities`: Mendapatkan semua aktivitas yang terkait dengan peluang.
- `GET /:id/notes`: Mendapatkan semua catatan yang terkait dengan peluang.

## Penjualan (`/api/sales`)

- `GET /`: Mendapatkan semua data penjualan.
- `POST /`: Membuat data penjualan baru.
- `GET /:id`: Mendapatkan detail penjualan berdasarkan ID.
- `PATCH /:id`: Memperbarui status penjualan berdasarkan ID.

## Produk (`/api/products`)

- `GET /`: Mendapatkan semua produk.
- `POST /`: Membuat produk baru.
- `GET /:id`: Mendapatkan detail produk berdasarkan ID.
- `PATCH /:id`: Memperbarui produk berdasarkan ID.
- `DELETE /:id`: Menghapus produk berdasarkan ID.

## Aktivitas (`/api/activities`)

- `GET /`: Mendapatkan semua aktivitas. Dapat difilter berdasarkan tipe (`?type=...`).
- `POST /`: Membuat aktivitas baru.
- `GET /my-activities`: Mendapatkan semua aktivitas yang dibuat oleh pengguna saat ini.
- `GET /:id`: Mendapatkan detail aktivitas berdasarkan ID.
- `PATCH /:id`: Memperbarui aktivitas berdasarkan ID.
- `DELETE /:id`: Menghapus aktivitas berdasarkan ID.

## Catatan (`/api/notes`)

- `GET /`: Mendapatkan semua catatan.
- `POST /`: Membuat catatan baru.
- `GET /myNotes`: Mendapatkan semua catatan yang dibuat oleh pengguna saat ini.
- `GET /:id`: Mendapatkan detail catatan berdasarkan ID.
- `PATCH /:id`: Memperbarui catatan berdasarkan ID.
- `DELETE /:id`: Menghapus catatan berdasarkan ID.

## Tugas (`/api/tasks`)

- `GET /`: Mendapatkan semua tugas.
- `POST /`: Membuat tugas baru.
- `GET /myTasks`: Mendapatkan semua tugas milik pengguna saat ini.
- `GET /status/:status`: Mendapatkan tugas berdasarkan status.
- `GET /priority/:priority`: Mendapatkan tugas berdasarkan prioritas.
- `GET /assigned/:assignedUserId`: Mendapatkan tugas berdasarkan ID pengguna yang ditugaskan.
- `GET /:id`: Mendapatkan detail tugas berdasarkan ID.
- `PATCH /:id`: Memperbarui tugas berdasarkan ID.
- `DELETE /:id`: Menghapus tugas berdasarkan ID.

## Dasbor (`/api/dashboard`)

- `GET /`: Mendapatkan data dasbor untuk pengguna saat ini.
- `PATCH /`: Memperbarui pengaturan dasbor (jika ada).