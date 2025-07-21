import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ekspor root direktori proyek dengan naik satu level dari /config
const projectRoot = path.join(__dirname, '..');

export { projectRoot };
