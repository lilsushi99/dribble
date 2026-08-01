import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import { Terminal, Github, Database, Server, Key, CheckCircle2, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';

export const InstallationGuidePage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Export Project Codebase to GitHub',
      icon: Github,
      description: 'Push your completed KINETIC frontend & Express backend repository to a private or public GitHub repository.',
      code: `git init
git add .
git commit -m "feat: production build for Hostinger deployment"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/kinetic-cms.git
git push -u origin main`,
      details: [
        'Ensure both the frontend React app and backend server files (server.ts / server.cjs, backend/database/db.sql) are included.',
        'Verify that package.json scripts include "build" and "start" commands configured for Express Node.js execution.',
        'Never upload production .env secrets directly to public repositories.',
      ],
    },
    {
      title: 'Step 2: Create MySQL Database & User in Hostinger',
      icon: Database,
      description: 'Provision a fresh MySQL database on your Hostinger hPanel control panel.',
      code: `Hostinger hPanel -> Databases -> MySQL Databases
1. Database Name: kinetic_production
2. MySQL Username: kinetic_db_user
3. Password: [GENERATE_SECURE_PASSWORD]
4. Click "Create Database"`,
      details: [
        'Log in to Hostinger hPanel.',
        'Navigate to Databases -> MySQL Databases.',
        'Create a new database e.g., u123456789_kinetic and a user with full permissions.',
        'Copy your MySQL Database Name, DB Username, DB Password, and DB Host (usually localhost or 127.0.0.1).',
      ],
    },
    {
      title: 'Step 3: Import db.sql into Hostinger phpMyAdmin',
      icon: Server,
      description: 'Execute the production schema and seed data in phpMyAdmin.',
      code: `Hostinger hPanel -> Databases -> phpMyAdmin
1. Click "Enter phpMyAdmin" next to your new database.
2. Select database 'kinetic_production' from the left sidebar.
3. Click the "Import" tab at the top.
4. Click "Choose File" and select 'backend/database/db.sql' from your project root.
5. Scroll to the bottom and click "Import".`,
      details: [
        'Verify that all tables were created: admin_users, layout_sections, projects, studio_data, blog_posts, media_files, form_submissions, settings, activity_logs, analytics.',
        'Check admin_users table for the seeded super administrator account.',
      ],
    },
    {
      title: 'Step 4: Configure Environment Variables (.env)',
      icon: Key,
      description: 'Set up production environment variables on your Hostinger Node.js environment or root server .env file.',
      code: `# Production Environment Configuration (.env)
NODE_ENV=production
PORT=3000

# MySQL Database Connection (Hostinger phpMyAdmin)
DB_HOST=localhost
DB_PORT=3306
DB_USER=u123456789_kinetic
DB_PASSWORD=YourSecureDatabasePassword
DB_NAME=u123456789_kinetic

# JWT Secret & Upload Path
JWT_SECRET=production_super_secret_jwt_key_kinetic_2026
UPLOAD_DIR=./public/uploads`,
      details: [
        'In Hostinger Node.js App Manager or server environment settings, add all listed environment variables.',
        'If deploying via SSH, create a file named .env in the root directory of your deployed app.',
      ],
    },
    {
      title: 'Step 5: Deploy Frontend & Express Backend on Hostinger',
      icon: Server,
      description: 'Build production static assets and launch Express Node.js server via Hostinger Node.js Application Setup.',
      code: `# Build Production Dist
npm install
npm run build

# Start Node.js Server in Hostinger Setup Manager
Application Startup File: dist/server.cjs (or server.ts with tsx)
Node.js Version: 18.x or 20.x LTS`,
      details: [
        'Hostinger hPanel -> Advanced / Websites -> Setup Node.js App.',
        'Select Node.js version 18.x or 20.x.',
        'Set Application root path e.g. public_html/kinetic.',
        'Set Application URL to your domain (e.g., https://yourdomain.com).',
        'Set Application Startup File to dist/server.cjs.',
        'Click "Run npm install" and "Restart Application".',
      ],
    },
    {
      title: 'Step 6: Test CMS Administrator Login After Deployment',
      icon: CheckCircle2,
      description: 'Verify login and end-to-end CMS management live in production.',
      code: `1. Visit https://yourdomain.com/admin/login
2. Default Super Admin Credentials:
   Email: admin@kinetic.com
   Password: adminpassword123
3. Change password immediately under Admin -> Users & Roles after initial login!`,
      details: [
        'Confirm that logging in creates an entry in activity_logs and updates "Last Admin Session" timestamp.',
        'Test uploading a new project cover image from device to confirm uploads directory permissions.',
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/80 via-zinc-900 to-indigo-950/80 border border-blue-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Hostinger Production Deployment Guide</h2>
          </div>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
            Complete step-by-step deployment instructions for GitHub, Hostinger Node.js environment, MySQL database, and phpMyAdmin.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-300 shrink-0">
          <Badge variant="blue">Hostinger Stack</Badge>
          <span>Node 20 + MySQL</span>
        </div>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={idx} className="p-6 space-y-4 border-slate-200 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">{step.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{step.description}</p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs p-4">
                <button
                  onClick={() => copyToClipboard(step.code, idx)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy Code"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="overflow-x-auto whitespace-pre-wrap">{step.code}</pre>
              </div>

              {/* Step Details Bullet Points */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                {step.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Troubleshooting Section */}
      <Card className="p-6 space-y-3 bg-slate-900 text-white border-blue-500/20">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold tracking-tight">Troubleshooting & Hostinger Checklist</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-white block">Permissions Issue on Uploads?</span>
            <p>Ensure the `public/uploads` directory has `755` or `777` permissions in Hostinger File Manager so uploaded files can be saved.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-white block">Database Connection Refused?</span>
            <p>Verify `DB_HOST=localhost` and check that the MySQL database user is associated with the database in Hostinger phpMyAdmin.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
