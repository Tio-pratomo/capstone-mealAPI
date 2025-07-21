import express from 'express';
import { logger } from './config/logger.js';
import morgan from 'morgan';
import path from 'path';
// Impor router aplikasi kita
import mealRoutes from './routes/mealRoutes.js'; // <--- PASTIKAN INI ADA

const app = express();
const port = process.env.PORT || 3000;

app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.set('view engine', 'ejs');

app.set('views', path.join(process.cwd(), 'views'));

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', mealRoutes);

app.use((req, res) => {
  logger.warn(` 404 Page not found : ${req.originalUrl}`);
  res.status(404).render('404', { message: 'resource not found' });
});

// Global Error Handler
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

app.listen(port, () => {
  logger.info(`Server berjalan di http://localhost:${port}`);
});
