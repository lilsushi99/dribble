# KINETIC CMS — Hostinger Node.js & MySQL Production Deployment Guide

This guide provides step-by-step instructions to deploy the complete full-stack **KINETIC CMS** to Hostinger Node.js Web Hosting with phpMyAdmin & MySQL database storage.

---

## 📋 Prerequisites & Requirements

- Hostinger Business or Cloud Web Hosting account with Node.js application support enabled.
- MySQL Database provisioned via Hostinger hPanel.
- Access to Hostinger File Manager or SSH / Git repository deployment.
- Domain name pointed to your Hostinger server.

---

## 🚀 Step-by-Step Installation Procedure

### Step 1: Upload Project Files
1. Build the production React application and bundle the Express server:
   ```bash
   npm run build
   ```
2. Upload all files (or repository contents) to your Hostinger project domain directory (e.g. `public_html` or `/domains/yourdomain.com/nodejs`).
3. Ensure the `uploads/` directory exists and has write permissions (`chmod 755 uploads`).

---

### Step 2: Create MySQL Database & Import `db.sql`
1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases -> MySQL Databases**.
3. Create a new database (e.g., `u123456789_kinetic_cms`) and user credentials.
4. Click on **phpMyAdmin** to open the database administration portal.
5. Select your newly created database and click **Import**.
6. Choose the file located in the project repository at `/backend/database/db.sql`.
7. Execute the import script. This will provision all necessary tables (`users`, `roles`, `projects`, `blog_posts`, `media`, `forms`, `form_submissions`, `settings`, `seo_settings`, `smtp_settings`, `activity_logs`, `analytics_events`).

---

### Step 3: Configure Production `.env`
Create a `.env` file in the root directory of your Node.js application on Hostinger with the following variables:

```env
# Database Credentials (Hostinger MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=u123456789_kinetic_user
DB_PASSWORD=YourStrongDatabasePassword123!
DB_NAME=u123456789_kinetic_cms

# Authentication Credentials
JWT_SECRET=kinetic_jwt_production_secure_key_2026_x89!
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=kinetic_jwt_refresh_production_secure_key_2026_z99!
JWT_REFRESH_EXPIRES_IN=7d

# Environment & Server Settings
NODE_ENV=production
PORT=3000
DOMAIN=https://your-kinetic-domain.com

# Upload Directory
UPLOAD_DIR=uploads

# Hostinger SMTP Mailer
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@your-kinetic-domain.com
SMTP_PASS=YourEmailPassword123!
SMTP_FROM=contact@your-kinetic-domain.com
```

---

### Step 4: Boot Node.js Application
1. In Hostinger hPanel, navigate to **Node.js Web Apps**.
2. Set **Application Root** to `/` or the directory where `package.json` resides.
3. Set **Application Startup File** to `dist/server.cjs` (or `server.ts` if running `tsx`).
4. Set Node.js version to **v18.x** or **v20.x**.
5. Click **Run NPM Install** if dependencies are missing.
6. Click **Restart Application**.

---

### Step 5: Initial Super Admin Login
1. Open your browser and navigate to:
   ```
   https://your-kinetic-domain.com/canopy
   ```
2. Log in with the initial default Super Admin credentials created by `db.sql`:
   - **Email:** `admin@kinetic-studio.com`
   - **Password:** `Admin@2026!`
3. Immediately navigate to **Users** in the sidebar to change your password and update your user profile.

---

## 🛠 Features & Verification Checklist

- **Admin Login:** `/canopy`
- **Manual XML Sitemap:** `/sitemap.xml` (Regenerated manually inside Admin -> SEO -> Generate Sitemap)
- **Hostinger SMTP Pipeline:** Configurable live in Admin -> Settings -> Hostinger SMTP
- **Media Upload Manager:** Uploaded files persist inside `uploads/` and are tracked in MySQL `media` table.
- **SEO & Social OpenGraph:** Custom meta titles and social cards per page.
