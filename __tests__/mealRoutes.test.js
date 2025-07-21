import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Increase Jest timeout for integration tests
jest.setTimeout(10000);

// Mock the entire mealController module
jest.mock('../controllers/mealController.js', () => ({
  getHomePage: jest.fn(),
  getMealDetailsPage: jest.fn(),
}));

describe('Meal Routes', () => {
  let app;
  let mealController;

  beforeAll(async () => {
    // Dynamically import mealController and mealRoutes after mocks are set up
    mealController = await import('../controllers/mealController.js');
    const mealRoutes = (await import('../routes/mealRoutes.js')).default;

    // Setup a minimal Express app for testing
    app = express();
    app.set('view engine', 'ejs');
    app.set('views', './views'); // Assuming views are in the root /views directory

    app.use('/', mealRoutes);

    // Basic error handling middleware for tests
    app.use((err, req, res, next) => {
      if (err.statusCode === 404) {
        return res.status(404).send('404 Not Found'); // Send simple string for route test
      }
      res.status(500).send('Something broke!');
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should call getHomePage controller', async () => {
      // Arrange
      mealController.getHomePage.mockImplementation((req, res, next) => {
        res.status(200).send('OK'); // Simulate a successful response
      });

      // Act
      const res = await request(app).get('/');

      // Assert
      expect(res.statusCode).toEqual(200);
      expect(mealController.getHomePage).toHaveBeenCalledTimes(1);
      expect(mealController.getHomePage).toHaveBeenCalledWith(
        expect.any(Object), // req
        expect.any(Object), // res
        expect.any(Function) // next
      );
    });

    it('should call getHomePage controller with category query', async () => {
      // Arrange
      const category = 'Beef';
      mealController.getHomePage.mockImplementation((req, res, next) => {
        res.status(200).send('OK');
      });

      // Act
      const res = await request(app).get(`/?category=${category}`);

      // Assert
      expect(res.statusCode).toEqual(200);
      expect(mealController.getHomePage).toHaveBeenCalledTimes(1);
      expect(mealController.getHomePage).toHaveBeenCalledWith(
        expect.objectContaining({ query: { category: category } }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should handle errors from getHomePage', async () => {
      // Arrange
      mealController.getHomePage.mockImplementation((req, res, next) => {
        next(new Error('Controller Error')); // Simulate an error from controller
      });

      // Act
      const res = await request(app).get('/');

      // Assert
      expect(res.statusCode).toEqual(500);
      expect(res.text).toContain('Something broke!');
      expect(mealController.getHomePage).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /meal/:id', () => {
    it('should call getMealDetailsPage controller for a valid ID', async () => {
      // Arrange
      const mealId = '123';
      mealController.getMealDetailsPage.mockImplementation((req, res, next) => {
        res.status(200).send('OK');
      });

      // Act
      const res = await request(app).get(`/meal/${mealId}`);

      // Assert
      expect(res.statusCode).toEqual(200);
      expect(mealController.getMealDetailsPage).toHaveBeenCalledTimes(1);
      expect(mealController.getMealDetailsPage).toHaveBeenCalledWith(
        expect.objectContaining({ params: { id: mealId } }),
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('should handle 404 from getMealDetailsPage', async () => {
      // Arrange
      const mealId = '999';
      mealController.getMealDetailsPage.mockImplementation((req, res, next) => {
        const error = new Error('Resep tidak ditemukan');
        error.statusCode = 404;
        next(error);
      });

      // Act
      const res = await request(app).get(`/meal/${mealId}`);

      // Assert
      expect(res.statusCode).toEqual(404);
      expect(res.text).toContain('404 Not Found');
      expect(mealController.getMealDetailsPage).toHaveBeenCalledTimes(1);
    });

    it('should handle other errors from getMealDetailsPage', async () => {
      // Arrange
      const mealId = '123';
      mealController.getMealDetailsPage.mockImplementation((req, res, next) => {
        next(new Error('API Error'));
      });

      // Act
      const res = await request(app).get(`/meal/${mealId}`);

      // Assert
      expect(res.statusCode).toEqual(500);
      expect(res.text).toContain('Something broke!');
      expect(mealController.getMealDetailsPage).toHaveBeenCalledTimes(1);
    });
  });
});
