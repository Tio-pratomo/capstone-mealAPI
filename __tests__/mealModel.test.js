import { jest } from '@jest/globals';

// Mock redaxios using a factory to replicate the .create().get() chain
const mockGet = jest.fn();
jest.mock('redaxios', () => ({
  __esModule: true, // Handle ES modules
  default: {
    create: jest.fn(() => ({
      get: mockGet,
    })),
  },
}));

describe('mealModel', () => {
  let mealModel;

  beforeEach(async () => {
    // Reset mocks and dynamically import the module before each test
    // This ensures the module gets the fresh mock every time.
    jest.clearAllMocks();
    mealModel = await import('../models/mealModel.js');
  });

  describe('getAllCategories', () => {
    it('should return an array of categories on successful API call', async () => {
      // Arrange
      const mockData = {
        data: {
          meals: [{ strCategory: 'Beef' }, { strCategory: 'Chicken' }],
        },
      };
      mockGet.mockResolvedValue(mockData);

      // Act
      const categories = await mealModel.getAllCategories();

      // Assert
      expect(categories).toEqual(mockData.data.meals);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('/list.php?c=list');
    });

    it('should return an empty array if the API call fails', async () => {
      // Arrange
      mockGet.mockRejectedValue(new Error('API Error'));

      // Act
      const categories = await mealModel.getAllCategories();

      // Assert
      expect(categories).toEqual([]);
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMealDetailsById', () => {
    it('should return meal details for a valid ID', async () => {
      // Arrange
      const mockMeal = { idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole' };
      const mockData = {
        data: {
          meals: [mockMeal],
        },
      };
      mockGet.mockResolvedValue(mockData);
      const mealId = '52772';

      // Act
      const meal = await mealModel.getMealDetailsById(mealId);

      // Assert
      expect(meal).toEqual(mockMeal);
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`/lookup.php?i=${mealId}`);
    });

    it('should return null if the API call fails', async () => {
      // Arrange
      mockGet.mockRejectedValue(new Error('API Error'));
      const mealId = '52772';

      // Act
      const meal = await mealModel.getMealDetailsById(mealId);

      // Assert
      expect(meal).toBeNull();
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it('should return null if no meal is found for the ID', async () => {
      // Arrange
      const mockData = { data: { meals: null } }; // API returns null for no results
      mockGet.mockResolvedValue(mockData);
      const mealId = 'invalidId';

      // Act
      const meal = await mealModel.getMealDetailsById(mealId);

      // Assert
      expect(meal).toBeNull();
    });

    it('should return null if no ID is provided', async () => {
      // Act
      const meal = await mealModel.getMealDetailsById(null);

      // Assert
      expect(meal).toBeNull();
      expect(mockGet).not.toHaveBeenCalled(); // Should not even attempt an API call
    });
  });

  describe('filterMealsByCategory', () => {
    it('should return an array of meals for a valid category', async () => {
      // Arrange
      const mockMeals = [{ idMeal: '52959', strMeal: 'Baked Salmon with Fennel & Tomatoes' }];
      const mockData = { data: { meals: mockMeals } };
      mockGet.mockResolvedValue(mockData);
      const category = 'Seafood';

      // Act
      const meals = await mealModel.filterMealsByCategory(category);

      // Assert
      expect(meals).toEqual(mockMeals);
      expect(mockGet).toHaveBeenCalledWith(`/filter.php?c=${category}`);
    });

    it('should return an empty array if the API call fails', async () => {
      // Arrange
      mockGet.mockRejectedValue(new Error('API Error'));

      // Act
      const meals = await mealModel.filterMealsByCategory('Seafood');

      // Assert
      expect(meals).toEqual([]);
    });

    it('should return an empty array if no category is provided', async () => {
      // Act
      const meals = await mealModel.filterMealsByCategory(null);

      // Assert
      expect(meals).toEqual([]);
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('getRandomMeal', () => {
    it('should return a single meal object on successful API call', async () => {
      // Arrange
      const mockMeal = { idMeal: '52772', strMeal: 'Teriyaki Chicken Casserole' };
      const mockData = { data: { meals: [mockMeal] } };
      mockGet.mockResolvedValue(mockData);

      // Act
      const meal = await mealModel.getRandomMeal();

      // Assert
      expect(meal).toEqual(mockMeal);
      expect(mockGet).toHaveBeenCalledWith('/random.php');
    });

    it('should return null if the API call fails', async () => {
      // Arrange
      mockGet.mockRejectedValue(new Error('API Error'));

      // Act
      const meal = await mealModel.getRandomMeal();

      // Assert
      expect(meal).toBeNull();
    });
  });
});