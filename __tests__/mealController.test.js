import { jest } from '@jest/globals';
import { getHomePage, getMealDetailsPage } from '../controllers/mealController.js';

// Mock the mealModel module
jest.mock('../models/mealModel.js', () => ({
  getAllCategories: jest.fn(),
  getRandomMeal: jest.fn(),
  filterMealsByCategory: jest.fn(),
  getMealDetailsById: jest.fn(),
}));

// Mock the logger module
jest.mock('../config/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('mealController', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let mealModel;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Dynamically import mealModel after mocks are set up
    mealModel = await import('../models/mealModel.js');

    mockReq = {};
    mockRes = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(), // Allows chaining like res.status(404).render()
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('getHomePage', () => {
    it('should render home page with random meals and categories when no category filter is provided', async () => {
      // Arrange
      const mockCategories = [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }];
      const mockRandomMeals = [];
      for (let i = 0; i < 8; i++) {
        mockRandomMeals.push({ idMeal: `${i}`, strMeal: `Random Meal ${i}` });
      }

      mealModel.getAllCategories.mockResolvedValue(mockCategories);
      mockRandomMeals.forEach(meal => {
        mealModel.getRandomMeal.mockResolvedValueOnce(meal);
      });

      mockReq.query = {}; // No category filter

      // Act
      await getHomePage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mealModel.getRandomMeal).toHaveBeenCalledTimes(8);
      expect(mockRes.render).toHaveBeenCalledWith('home', {
        title: 'Culinary Delights - Resep Lezat',
        meals: expect.arrayContaining(mockRandomMeals),
        categories: mockCategories,
        selectedCategory: '',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should render home page with filtered meals when category filter is provided', async () => {
      // Arrange
      const mockCategories = [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }];
      const mockFilteredMeals = [{ idMeal: '3', strMeal: 'Filtered Meal 1' }];
      const category = 'Beef';

      mealModel.getAllCategories.mockResolvedValue(mockCategories);
      mealModel.filterMealsByCategory.mockResolvedValue(mockFilteredMeals);

      mockReq.query = { category: category };

      // Act
      await getHomePage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mealModel.filterMealsByCategory).toHaveBeenCalledWith(category);
      expect(mockRes.render).toHaveBeenCalledWith('home', {
        title: 'Culinary Delights - Resep Lezat',
        meals: mockFilteredMeals,
        categories: mockCategories,
        selectedCategory: category,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if getAllCategories fails', async () => {
      // Arrange
      const error = new Error('API Error');
      mealModel.getAllCategories.mockRejectedValue(error);

      mockReq.query = {};

      // Act
      await getHomePage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getAllCategories).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.render).not.toHaveBeenCalled();
    });
  });

  describe('getMealDetailsPage', () => {
    it('should render meal-detail page for a valid meal ID', async () => {
      // Arrange
      const mockMeal = { idMeal: '123', strMeal: 'Test Meal' };
      mealModel.getMealDetailsById.mockResolvedValue(mockMeal);

      mockReq.params = { id: '123' };

      // Act
      await getMealDetailsPage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getMealDetailsById).toHaveBeenCalledWith('123');
      expect(mockRes.render).toHaveBeenCalledWith('meal-detail', {
        title: mockMeal.strMeal,
        meal: mockMeal,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should render 404 page if meal is not found', async () => {
      // Arrange
      mealModel.getMealDetailsById.mockResolvedValue(null);

      mockReq.params = { id: '999' };

      // Act
      await getMealDetailsPage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getMealDetailsById).toHaveBeenCalledWith('999');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.render).toHaveBeenCalledWith('404', { title: 'Resep Tidak Ditemukan' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if getMealDetailsById fails', async () => {
      // Arrange
      const error = new Error('API Error');
      mealModel.getMealDetailsById.mockRejectedValue(error);

      mockReq.params = { id: '123' };

      // Act
      await getMealDetailsPage(mockReq, mockRes, mockNext);

      // Assert
      expect(mealModel.getMealDetailsById).toHaveBeenCalledWith('123');
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.render).not.toHaveBeenCalled();
    });
  });
});
