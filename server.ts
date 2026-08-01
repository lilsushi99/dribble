import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/app';
import { testDatabaseConnection } from './backend/config/database';
import { logger } from './backend/utils/logger';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  // Test MySQL connection
  await testDatabaseConnection();

  // Integrated Express & Vite Server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`KINETIC CMS Backend Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
