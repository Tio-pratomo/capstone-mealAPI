import axios from 'redaxios';
import { logger } from '../config/logger.js';

const mealAPI = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
});

/**
 * Mengambil resep berdasarkan nama pencarian.
 * @param {string} query Nama resep yang dicari.
 * @returns {Array} Array berisi objek resep, atau array kosong jika tidak ditemukan/error.
 */
export async function searchMealsByName(query) {
  if (!query) {
    logger.warn('Search query is empty');
    return [];
  }

  try {
    logger.info(`Fetch data by query : ${query}`);
    const response = await mealAPI.get(`/search.php?s=${query}`);

    return response.data.meals || [];
  } catch (error) {
    logger.error(`ERROR searching ${query} : ${error.message}`);
    return [];
  }
}

/**
 * Mengambil detail resep berdasarkan ID.
 * @param {string} id ID resep.
 * @returns {Object|null} Objek resep atau null jika tidak ditemukan/error.
 */

export async function getMealDetailsById(id) {
  if (!id) {
    logger.warn(`Your ID is empty or undefined or NULL`);
    return null;
  }

  try {
    logger.info(`get data with idMeal: ${id}`);
    const response = await mealAPI.get(`/lookup.php?i=${id}`);

    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    logger.error(`Error get meal bt id: ${id} : ${error.message}`);
    return null;
  }
}

/**
 * Mengambil daftar semua kategori makanan.
 * @returns {Array} Array berisi objek kategori, atau array kosong jika error.
 */

export async function getAllCategories() {
  try {
    logger.info(`get all categories`);
    const response = await mealAPI.get('/list.php?c=list');

    return response.data.meals || [];
  } catch (error) {
    logger.error(`error to get all categories: ${error.message}`);
    return [];
  }
}

/**
 * Mengambil resep berdasarkan kategori.
 * @param {string} category Nama kategori.
 * @returns {Array} Array berisi objek resep singkat, atau array kosong jika tidak ditemukan/error.
 */
export async function filterMealsByCategory(category) {
  if (!category) {
    logger.warn('Category filter is empty.');
    return [];
  }
  try {
    logger.info(`Fetching meals by category: ${category}`);
    const response = await mealAPI.get(`/filter.php?c=${category}`);
    // Filter API mengembalikan idMeal, strMeal, strMealThumb.
    return response.data.meals || [];
  } catch (error) {
    logger.error(
      `Error filtering meals by category (${category}): ${error.message}`,
      { stack: error.stack },
    );
    return [];
  }
}

// Tambahkan fungsi lain sesuai kebutuhan, misalnya untuk resep acak
export async function getRandomMeal() {
  try {
    logger.info('Fetching random meal.');
    const response = await mealAPI.get(`/random.php`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    logger.error(`Error fetching random meal: ${error.message}`, {
      stack: error.stack,
    });
    return null;
  }
}
