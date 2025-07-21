/**
 * @fileoverview File utama aplikasi Express untuk Culinary Delights App.
 * Mengatur middleware, rute, dan penanganan error global.
 */

import express from 'express';
import { logger } from './config/logger.js';
import morgan from 'morgan';
import path from 'path';
// Impor router aplikasi kita
import mealRoutes from './routes/mealRoutes.js'; // <--- PASTIKAN INI ADA

const app = express();
const port = process.env.PORT || 3000;

/**
 * Middleware untuk logging HTTP request menggunakan Morgan.
 * Output log akan diarahkan ke Winston logger.
 */
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

/**
 * Mengatur view engine menjadi EJS.
 */
app.set('view engine', 'ejs');

/**
 * Mengatur direktori 'views' untuk template EJS.
 * Menggunakan process.cwd() untuk memastikan jalur yang benar di lingkungan deployment (misalnya Vercel).
 */
app.set('views', path.join(process.cwd(), 'views'));

/**
 * Mengatur direktori 'public' sebagai direktori statis.
 * File-file di direktori ini (seperti CSS, gambar) dapat diakses langsung oleh klien.
 * Menggunakan process.cwd() untuk memastikan jalur yang benar di lingkungan deployment.
 */
app.use(express.static(path.join(process.cwd(), 'public')));

/**
 * Middleware untuk mengurai data dari form HTML (URL-encoded).
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware untuk mengurai body permintaan dalam format JSON.
 */
app.use(express.json());

/**
 * Menggunakan rute yang didefinisikan dalam mealRoutes untuk semua permintaan yang dimulai dari root ('/').
 */
app.use('/', mealRoutes);

/**
 * Middleware penanganan 404 (Not Found).
 * Akan dijalankan jika tidak ada rute yang cocok dengan permintaan.
 */
app.use((req, res) => {
  logger.warn(` 404 Page not found : ${req.originalUrl}`);
  res.status(404).render('404', { message: 'resource not found' });
});

/**
 * Global Error Handler.
 * Middleware ini akan menangani semua error yang terjadi di aplikasi.
 * Mengirimkan respons error yang sesuai ke klien dan mencatat error.
 *
 * @param {Error} err - Objek error yang dilemparkan.
 * @param {object} req - Objek permintaan Express.
 * @param {object} res - Objek respons Express.
 * @param {function} next - Fungsi middleware berikutnya.
 */
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(500).render('error', {
    title: 'Server Error',
    message: isProduction
      ? 'Maaf, terjadi kesalahan pada server.'
      : err.message,
    stack: isProduction ? null : err.stack,
  });
});

/**
 * Memulai server Express.
 * Aplikasi akan mendengarkan permintaan pada port yang ditentukan.
 */
app.listen(port, () => {
  logger.info(`Server berjalan di http://localhost:${port}`);
});
