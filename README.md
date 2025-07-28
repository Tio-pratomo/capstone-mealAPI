# Culinary Delights App

Aplikasi web sederhana yang dibangun sebagai bagian dari Capstone Project untuk mencoba penggunaan API publik. Aplikasi ini memungkinkan pengguna untuk menjelajahi resep berdasarkan kategori dan melihat detail lengkap dari resep yang dipilih.

## Fitur Utama

- **Penjelajahan Resep Berdasarkan Kategori:** Temukan berbagai resep yang dikelompokkan berdasarkan kategori masakan.
- **Detail Resep:** Lihat informasi lengkap untuk setiap resep, termasuk bahan-bahan, instruksi, dan gambar.

## Teknologi yang Digunakan

- **Backend:**
  - Node.js
  - Express.js: Framework web untuk Node.js.
  - EJS (Embedded JavaScript): Engine template untuk menghasilkan tampilan HTML.
  - Morgan: Middleware logger HTTP request.
  - Winston: Library logging yang fleksibel.
  - Redaxios: Klien HTTP ringan untuk membuat permintaan API.
- **Frontend:**
  - HTML, CSS
  - Tailwind CSS: Framework CSS utility-first untuk styling cepat.
  - DaisyUI: Plugin komponen Tailwind CSS.
- **Pengembangan & Pengujian:**
  - Nodemon: Memantau perubahan file dan me-restart server secara otomatis.
  - Concurrently: Menjalankan beberapa perintah secara paralel.
  - Jest: Framework pengujian JavaScript.
  - Supertest: Library untuk menguji HTTP assertions.

## Instalasi dan Menjalankan Proyek

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**

    ```bash
    git clone https://github.com/Tio-pratomo/capstone-mealAPI.git
    cd culinary-delights-app
    ```

2.  **Instal dependensi:**
    Proyek ini menggunakan `pnpm` sebagai package manager. Pastikan Anda sudah menginstalnya.

    ```bash
    pnpm install
    ```

3.  **Jalankan aplikasi:**

    - **Mode Pengembangan (Development):**

      ```bash
      pnpm run dev
      ```

      Ini akan menjalankan server Node.js dan memantau perubahan file CSS.

    - **Mode Produksi (Production):**
      ```bash
      pnpm run build
      pnpm start
      ```
      Ini akan membangun CSS dan kemudian menjalankan server Node.js.

4.  **Akses Aplikasi:**
    Aplikasi akan berjalan di `http://localhost:3000` (atau port lain yang dikonfigurasi).

## Struktur Proyek

```
.
├── app.js                  # File utama aplikasi
├── app.css                 # File CSS sumber untuk Tailwind
├── package.json            # Metadata proyek dan dependensi
├── public/                 # File statis (CSS yang dikompilasi, gambar, dll.)
│   └── styles.css
├── routes/                 # Definisi rute aplikasi
│   └── mealRoutes.js
├── controllers/            # Logika bisnis untuk setiap rute
│   └── mealController.js
├── models/                 # Model data atau interaksi dengan API eksternal
│   └── mealModel.js
├── views/                  # Template EJS untuk tampilan
│   ├── home.ejs
│   ├── meal-detail.ejs
│   └── layouts/
│       ├── header.ejs
│       └── footer.ejs
├── config/                 # Konfigurasi aplikasi (logger)
│   └── logger.js
└── __tests__/              # File pengujian
    ├── mealController.test.js
    ├── mealModel.test.js
    └── mealRoutes.test.js
```

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori dan buat pull request dengan perubahan Anda.

## Lisensi

Proyek ini dilisensikan di bawah lisensi ISC.
