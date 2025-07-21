/**
 * @fileoverview Modul ini berisi fungsi-fungsi controller untuk menangani permintaan terkait resep makanan.
 * Ini berinteraksi dengan model untuk mengambil data dan merender tampilan yang sesuai.
 */

import * as mealModel from '../models/mealModel.js';
import { logger } from '../config/logger.js';

/**
 * Menampilkan halaman utama aplikasi.
 * Secara default akan menampilkan beberapa resep acak.
 * Dapat juga menangani filter berdasarkan kategori jika ada query 'category' di URL.
 *
 * @param {object} req - Objek permintaan Express.
 * @param {object} res - Objek respons Express.
 * @param {function} next - Fungsi middleware berikutnya.
 * @returns {Promise<void>} Merender halaman 'home' dengan data resep dan kategori.
 */
export async function getHomePage(req, res, next) {
  try {
    let meals = [];
    const categoryFilter = req.query.category;

    const categories = await mealModel.getAllCategories();

    if (categoryFilter) {
      logger.info(
        `Controller: Filtering meals by category "${categoryFilter}"`,
      );
      meals = await mealModel.filterMealsByCategory(categoryFilter);
    } else {
      logger.info('Controller: Fetching random meals for homepage.');
      const randomMeals = [];
      for (let i = 0; i < 8; i++) {
        const meal = await mealModel.getRandomMeal();
        if (meal) {
          randomMeals.push(meal);
        }
      }
      meals = randomMeals;
    }

    res.render('home', {
      title: 'Culinary Delights - Resep Lezat',
      meals: meals,
      categories: categories,
      selectedCategory: categoryFilter || '',
    });
  } catch (error) {
    logger.error(`Controller Error in getHomePage: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
}

/**
 * Menampilkan halaman detail untuk resep tertentu.
 * Mengambil ID resep dari parameter URL.
 *
 * @param {object} req - Objek permintaan Express.
 * @param {object} res - Objek respons Express.
 * @param {function} next - Fungsi middleware berikutnya.
 * @returns {Promise<void>} Merender halaman 'meal-detail' dengan data resep yang ditemukan, atau halaman 404 jika tidak ditemukan.
 * @throws {Error} Jika resep tidak ditemukan, akan melempar error dengan statusCode 404.
 */
export async function getMealDetailsPage(req, res, next) {
  try {
    const mealId = req.params.id;
    logger.info(`Controller: Fetching details for meal ID: ${mealId}`);
    const meal = await mealModel.getMealDetailsById(mealId);

    if (!meal) {
      logger.warn(`Controller: Meal with ID ${mealId} not found.`);
      const error = new Error('Resep tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    res.render('meal-detail', {
      title: meal.strMeal,
      meal: meal,
    });
  } catch (error) {
    logger.error(
      `Controller Error in getMealDetailsPage (${req.params.id}): ${error.message}`,
      { stack: error.stack },
    );
    if (error.statusCode === 404) {
      return res.status(404).render('404', { title: 'Resep Tidak Ditemukan' });
    }
    next(error);
  }
}
