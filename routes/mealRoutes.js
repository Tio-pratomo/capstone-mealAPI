// routes/mealRoutes.js
import { Router } from 'express'; // Impor Router dari Express
import {
  getHomePage,
  getMealDetailsPage,
} from '../controllers/mealController.js'; // Impor fungsi-fungsi controller

const router = Router(); // Buat instance Router

// Rute untuk halaman utama
// Ini akan menangani:
// - /
// - /?q=chicken (pencarian)
// - /?category=Dessert (filter kategori)
router.get('/', getHomePage);

// Rute untuk halaman detail resep berdasarkan ID
// Parameter ':id' akan tersedia di req.params.id
router.get('/meal/:id', getMealDetailsPage);

// Tambahkan rute lain di sini jika diperlukan di masa mendatang
// router.get('/random', getRandomMealPage);
// router.get('/categories', getCategoriesPage);

export default router; // Ekspor router
