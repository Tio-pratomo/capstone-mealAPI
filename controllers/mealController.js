// controllers/mealController.js
import * as mealModel from '../models/mealModel.js'; // Impor semua fungsi dari mealModel
import { logger } from '../config/logger.js'; // Impor logger

/**
 * Menampilkan halaman utama dengan resep.
 * Secara default akan menampilkan beberapa resep acak.
 * Dapat juga menangani pencarian jika ada query 'q' di URL.
 * Mengirimkan data kategori untuk dropdown filter.
 */
export async function getHomePage(req, res, next) {
  try {
    let meals = [];
    const categoryFilter = req.query.category; // Dapatkan filter kategori dari URL (contoh: /?category=Dessert)

    // Dapatkan semua kategori untuk dropdown
    const categories = await mealModel.getAllCategories();

    if (categoryFilter) {
      // Jika ada filter kategori, filter resep berdasarkan kategori
      logger.info(
        `Controller: Filtering meals by category "${categoryFilter}"`,
      );
      meals = await mealModel.filterMealsByCategory(categoryFilter);
    } else {
      // Jika tidak ada pencarian atau filter, tampilkan beberapa resep acak
      logger.info('Controller: Fetching random meals for homepage.');
      const randomMeals = [];
      // Ambil beberapa resep acak. API hanya menyediakan satu per request, jadi lakukan loop.
      for (let i = 0; i < 8; i++) {
        // Ambil 8 resep acak
        const meal = await mealModel.getRandomMeal();
        if (meal) {
          randomMeals.push(meal);
        }
      }
      meals = randomMeals;
    }

    res.render('home', {
      title: 'Culinary Delights - Resep Lezat',
      meals: meals, // Data resep yang akan ditampilkan di view
      categories: categories, // Data kategori untuk dropdown
      selectedCategory: categoryFilter || '', // Kirim kembali kategori yang dipilih ke view
    });
  } catch (error) {
    logger.error(`Controller Error in getHomePage: ${error.message}`, {
      stack: error.stack,
    });
    next(error); // Teruskan error ke error handling middleware Express
  }
}

/**
 * Menampilkan halaman detail resep.
 * Mengambil ID resep dari parameter URL.
 */
export async function getMealDetailsPage(req, res, next) {
  try {
    const mealId = req.params.id; // Dapatkan ID resep dari URL (contoh: /meal/52772)
    logger.info(`Controller: Fetching details for meal ID: ${mealId}`);
    const meal = await mealModel.getMealDetailsById(mealId);

    if (!meal) {
      logger.warn(`Controller: Meal with ID ${mealId} not found.`);
      // Jika resep tidak ditemukan, lempar error 404 atau render halaman 404
      const error = new Error('Resep tidak ditemukan');
      error.statusCode = 404;
      throw error; // Akan ditangkap oleh global error handler
    }

    res.render('meal-detail', {
      title: meal.strMeal, // Judul halaman dari nama resep
      meal: meal, // Data resep detail
    });
  } catch (error) {
    logger.error(
      `Controller Error in getMealDetailsPage (${req.params.id}): ${error.message}`,
      { stack: error.stack },
    );
    // Jika error adalah 404, kita bisa render halaman 404 secara spesifik
    if (error.statusCode === 404) {
      return res.status(404).render('404', { title: 'Resep Tidak Ditemukan' });
    }
    next(error); // Teruskan error lain ke error handling middleware Express
  }
}
