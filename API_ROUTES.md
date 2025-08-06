## Daftar Rute API CRM

Berikut adalah daftar lengkap semua endpoint yang tersedia dalam aplikasi, diorganisir berdasarkan fitur/modul.

### Modul: Authentication (`/api/auth`)
| Method | Path                  | Deskripsi                  |
| :----- | :-------------------- | :------------------------- |
| `POST` | `/register`           | Registrasi pengguna baru   |
| `POST` | `/login`              | Login untuk mendapatkan token |

### Modul: Users (`/api/users`)
| Method | Path                  | Deskripsi                           |
| :----- | :-------------------- | :---------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua pengguna (ADMIN)  |
| `POST` | `/`                   | Membuat pengguna baru (ADMIN)       |
| `GET`  | `/:id`                | Mendapatkan detail satu pengguna    |
| `PATCH`| `/:id`                | Memperbarui satu pengguna           |
| `DELETE`| `/:id`               | Menghapus satu pengguna (soft delete) |
| `GET`  | `/:id/customers`      | Mendapatkan semua customer oleh pengguna |
| `GET`  | `/:id/tasks/assigned` | Mendapatkan semua task untuk pengguna |

### Modul: Customers (`/api/customers`)
| Method | Path                  | Deskripsi                      |
| :----- | :-------------------- | :----------------------------- |
| `GET`  | `/`                   | Mendapatkan semua customer     |
| `POST` | `/`                   | Membuat customer baru          |
| `GET`  | `/:id`                | Mendapatkan detail satu customer |
| `PATCH`| `/:id`                | Memperbarui satu customer      |
| `DELETE`| `/:id`               | Menghapus satu customer        |

### Modul: Contacts (`/api/contacts`)
| Method | Path                  | Deskripsi                     |
| :----- | :-------------------- | :---------------------------- |
| `GET`  | `/`                   | Mendapatkan semua contact     |
| `POST` | `/`                   | Membuat contact baru          |
| `GET`  | `/:id`                | Mendapatkan detail satu contact |
| `PATCH`| `/:id`                | Memperbarui satu contact      |
| `DELETE`| `/:id`               | Menghapus satu contact        |

### Modul: Leads (`/api/leads`)
| Method | Path                  | Deskripsi                           |
| :----- | :-------------------- | :---------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua lead              |
| `POST` | `/`                   | Membuat lead baru                   |
| `GET`  | `/status/:status`     | Mendapatkan lead berdasarkan status |
| `GET`  | `/:id`                | Mendapatkan detail satu lead        |
| `PATCH`| `/:id`                | Memperbarui satu lead               |
| `DELETE`| `/:id`               | Menghapus satu lead                 |
| `POST` | `/:id/convert`        | Mengonversi lead menjadi customer, contact, & opportunity |

### Modul: Opportunities (`/api/opportunities`)
| Method | Path                  | Deskripsi                         |
| :----- | :-------------------- | :-------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua opportunity     |
| `POST` | `/`                   | Membuat opportunity baru          |
| `GET`  | `/:id`                | Mendapatkan detail satu opportunity |
| `PATCH`| `/:id`                | Memperbarui satu opportunity      |
| `DELETE`| `/:id`               | Menghapus satu opportunity        |

### Modul: Products (`/api/products`)
| Method | Path                  | Deskripsi                      |
| :----- | :-------------------- | :----------------------------- |
| `GET`  | `/`                   | Mendapatkan semua produk aktif |
| `POST` | `/`                   | Membuat produk baru (ADMIN)    |
| `GET`  | `/:id`                | Mendapatkan detail satu produk |
| `PATCH`| `/:id`                | Memperbarui satu produk (ADMIN)|
| `DELETE`| `/:id`               | Menonaktifkan satu produk (ADMIN)|

### Modul: Sales (`/api/sales`)
| Method | Path                  | Deskripsi                  |
| :----- | :-------------------- | :------------------------- |
| `GET`  | `/`                   | Mendapatkan semua penjualan|
| `POST` | `/`                   | Membuat penjualan baru     |
| `GET`  | `/:id`                | Mendapatkan detail satu penjualan |
| `PATCH`| `/:id`                | Memperbarui status penjualan |

### Modul: Tasks (`/api/tasks`)
| Method | Path                  | Deskripsi                        |
| :----- | :-------------------- | :------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua task (ADMIN)   |
| `POST` | `/`                   | Membuat task baru                |
| `GET`  | `/myTasks`            | Mendapatkan task milik pengguna    |
| `GET`  | `/status/:status`     | Mendapatkan task berdasarkan status |
| `GET`  | `/priority/:priority` | Mendapatkan task berdasarkan prioritas |
| `GET`  | `/assigned/:assignedUserId` | Mendapatkan task berdasarkan siapa yang ditugaskan |
| `GET`  | `/:id`                | Mendapatkan detail satu task     |
| `PATCH`| `/:id`                | Memperbarui satu task            |
| `DELETE`| `/:id`               | Menghapus satu task              |

### Modul: Notes (`/api/notes`)
| Method | Path                  | Deskripsi                        |
| :----- | :-------------------- | :------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua note (ADMIN/MANAGER) |
| `POST` | `/`                   | Membuat note baru                |
| `GET`  | `/myNotes`            | Mendapatkan note milik pengguna    |
| `GET`  | `/:id`                | Mendapatkan detail satu note     |
| `PATCH`| `/:id`                | Memperbarui satu note            |
| `DELETE`| `/:id`               | Menghapus satu note              |

### Modul: Activities (`/api/activities`)
| Method | Path                  | Deskripsi                        |
| :----- | :-------------------- | :------------------------------- |
| `GET`  | `/`                   | Mendapatkan semua activity (ADMIN/MANAGER) |
| `POST` | `/`                   | Membuat activity baru            |
| `GET`  | `/myActivities`       | Mendapatkan activity milik pengguna |
| `GET`  | `/:id`                | Mendapatkan detail satu activity |
| `PATCH`| `/:id`                | Memperbarui satu activity        |
| `DELETE`| `/:id`               | Menghapus satu activity          |

### Modul: Dashboard (`/api/dashboard`)
| Method | Path                  | Deskripsi                  |
| :----- | :-------------------- | :------------------------- |
| `GET`  | `/`                   | Mendapatkan data dasbor pengguna |
| `PATCH`| `/`                   | Memperbarui layout dasbor pengguna |
