import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { SeoService } from './services/seo.service';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for file uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Serve sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.header('Content-Type', 'application/xml');
      return res.sendFile(sitemapPath);
    }
    const seoService = new SeoService();
    const result = await seoService.generateSitemap();
    res.header('Content-Type', 'application/xml');
    return res.send(result.xml);
  } catch (err: any) {
    res.status(500).send('<error>Failed to serve sitemap.xml</error>');
  }
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'KINETIC CMS API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1', apiRoutes);

// 404 & Error Handling
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

export default app;
