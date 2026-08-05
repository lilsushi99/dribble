-- ==============================================================================
-- COMIC ART STUDIO / KINETIC CMS — COMPLETE PRODUCTION DATABASE SCHEMA
-- Compatible with Hostinger phpMyAdmin (MySQL 8.0 / MariaDB 10.4+)
-- ==============================================================================
-- NOTE: Do NOT include 'CREATE DATABASE' per Hostinger deployment guidelines.
-- Import this SQL directly into your Hostinger phpMyAdmin target database.
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `analytics_events`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `smtp_settings`;
DROP TABLE IF EXISTS `seo_settings`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `media_library`;
DROP TABLE IF EXISTS `form_submissions`;
DROP TABLE IF EXISTS `forms`;
DROP TABLE IF EXISTS `contact_page_settings`;
DROP TABLE IF EXISTS `blog_page_settings`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `blog_categories`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `studio_page`;
DROP TABLE IF EXISTS `homepage_content`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. ACCESS CONTROL: ROLES & PERMISSIONS
-- ------------------------------------------------------------------------------

CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Super Admin', 'Full unrestricted control over system settings, users, CMS, and database.'),
(2, 'Admin', 'Control over CMS content, media, SEO, forms, and analytics.'),
(3, 'Editor', 'Control over blogs, portfolio projects, and media uploads.');

CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `module` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`id`, `code`, `name`, `description`, `module`) VALUES
(1, 'manage_users', 'Manage Users', 'Create, update, and delete admin users', 'users'),
(2, 'manage_roles', 'Manage Roles', 'Assign and edit role permissions', 'users'),
(3, 'manage_settings', 'Manage System Settings', 'Configure site branding, SMTP, and global preferences', 'settings'),
(4, 'manage_cms', 'Manage Page Content', 'Edit homepage, studio page, and layout sections', 'cms'),
(5, 'manage_projects', 'Manage Projects', 'Create and modify portfolio project case studies', 'projects'),
(6, 'manage_blog', 'Manage Blog Articles', 'Publish and edit articles, tags, and categories', 'blog'),
(7, 'manage_media', 'Manage Media Library', 'Upload and delete image/asset uploads', 'media'),
(8, 'view_submissions', 'View Form Submissions', 'Inspect contact form inquiries and submissions', 'forms'),
(9, 'manage_seo', 'Manage SEO Settings', 'Configure page metadata, OG tags, and structured data', 'seo');

CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9),
(2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9),
(3, 4), (3, 5), (3, 6), (3, 7);

-- ------------------------------------------------------------------------------
-- 2. SYSTEM USERS & AUTHENTICATION SESSIONS
-- ------------------------------------------------------------------------------

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `role_id` INT NOT NULL DEFAULT 3,
  `avatar_url` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Super Admin & Editor accounts (Hashed password: 'AdminPassword2026!')
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role_id`, `avatar_url`, `is_active`) VALUES
(1, 'admin@kinetic-studio.com', '$2a$10$wT8B14dYkM0Lg8P./f9r.OqR63R0iS98P.6L5sO2kU1.1e8x5a3yG', 'Super', 'Admin', 1, '/uploads/avatars/admin-avatar.jpg', 1),
(2, 'editor@kinetic-studio.com', '$2a$10$wT8B14dYkM0Lg8P./f9r.OqR63R0iS98P.6L5sO2kU1.1e8x5a3yG', 'Creative', 'Editor', 3, '/uploads/avatars/editor-avatar.jpg', 1);

CREATE TABLE `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `refresh_token` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `refresh_token` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. GLOBAL SITE SETTINGS & THEME BRANDING
-- ------------------------------------------------------------------------------

CREATE TABLE `site_settings` (
  `setting_key` VARCHAR(191) PRIMARY KEY,
  `setting_value` LONGTEXT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `category`) VALUES
('site_title', 'Comic Art Studio — Bespoke Graphic Novel Architecture', 'general'),
('site_name', 'Comic Art Studio', 'general'),
('site_tagline', 'Translating sequential manga pacing and high-contrast inking into bespoke digital monuments.', 'general'),
('company_name', 'Comic Art Studio Ltd.', 'general'),
('contact_email', 'contact@kinetic-studio.com', 'general'),
('contact_phone', '+1 (800) 555-0199', 'general'),
('address', '100 Architectural Way, Studio District, CA 90210', 'general'),
('copyright_text', '© 2026 Comic Art Studio Ltd. All rights reserved.', 'general'),
('footer_info', 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.', 'general'),
('designer_credit', 'Comic Art Studio Atelier', 'general'),
('designer_url', 'https://kinetic-studio.com', 'general'),
('white_logo', '/uploads/logos/logo-white.svg', 'assets'),
('black_logo', '/uploads/logos/logo-black.svg', 'assets'),
('favicon', '/favicon.ico', 'assets'),
('social_twitter', 'https://twitter.com', 'social'),
('social_instagram', 'https://instagram.com', 'social'),
('social_linkedin', 'https://linkedin.com', 'social'),
('social_github', 'https://github.com', 'social'),
('primary_accent_color', '#E6A800', 'theme'),
('theme_primary', '#0097FF', 'theme'),
('theme_button', '#0097FF', 'theme'),
('theme_accent', '#E6A800', 'theme'),
('theme_heading', '#FFFFFF', 'theme'),
('theme_body', '#9A9A9E', 'theme'),
('theme_bg', '#050505', 'theme');

CREATE TABLE `settings` (
  `key_name` VARCHAR(191) PRIMARY KEY,
  `value` LONGTEXT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`key_name`, `value`, `category`) VALUES
('site_name', 'Comic Art Studio', 'general'),
('company_name', 'Comic Art Studio Ltd.', 'general'),
('email', 'contact@kinetic-studio.com', 'general'),
('phone', '+1 (800) 555-0199', 'general'),
('address', '100 Architectural Way, Studio District, CA 90210', 'general'),
('copyright_text', '© 2026 Comic Art Studio Ltd. All rights reserved.', 'general'),
('footer_info', 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.', 'general'),
('designer_credit', 'Comic Art Studio Atelier', 'general'),
('designer_url', 'https://kinetic-studio.com', 'general'),
('white_logo', '/uploads/logos/logo-white.svg', 'assets'),
('black_logo', '/uploads/logos/logo-black.svg', 'assets'),
('favicon', '/favicon.ico', 'assets'),
('social_twitter', 'https://twitter.com', 'social'),
('social_instagram', 'https://instagram.com', 'social'),
('social_linkedin', 'https://linkedin.com', 'social'),
('social_github', 'https://github.com', 'social');

-- ------------------------------------------------------------------------------
-- 4. DYNAMIC HOMEPAGE CONTENT
-- ------------------------------------------------------------------------------

CREATE TABLE `homepage_content` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `hero_heading` VARCHAR(255) NOT NULL,
  `hero_subtitle` TEXT NOT NULL,
  `hero_cta_primary_text` VARCHAR(100) NOT NULL,
  `hero_cta_primary_url` VARCHAR(255) NOT NULL,
  `hero_cta_secondary_text` VARCHAR(100) NULL,
  `hero_cta_secondary_url` VARCHAR(255) NULL,
  `story_title` VARCHAR(255) NOT NULL,
  `story_subtitle` TEXT NULL,
  `story_content` LONGTEXT NOT NULL,
  `mission_statement` TEXT NOT NULL,
  `vision_statement` TEXT NOT NULL,
  `philosophy_statement` TEXT NOT NULL,
  `statistics_json` LONGTEXT NULL,
  `marquee_items_json` LONGTEXT NULL,
  `cta_title` VARCHAR(255) NOT NULL,
  `cta_subtitle` TEXT NULL,
  `cta_button_text` VARCHAR(100) NOT NULL,
  `cta_button_url` VARCHAR(255) NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `homepage_content` (`id`, `hero_heading`, `hero_subtitle`, `hero_cta_primary_text`, `hero_cta_primary_url`, `hero_cta_secondary_text`, `hero_cta_secondary_url`, `story_title`, `story_subtitle`, `story_content`, `mission_statement`, `vision_statement`, `philosophy_statement`, `statistics_json`, `marquee_items_json`, `cta_title`, `cta_subtitle`, `cta_button_text`, `cta_button_url`) VALUES
(1, 
 'Crafting Digital Monuments with Sequential Comic Precision', 
 'Comic Art Studio operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.', 
 'Explore Selected Projects', '/projects', 
 'Read Studio Philosophy', '/studio', 
 'The Origin & Craft', 'Uncompromising discipline meets bespoke visual storytelling.', 
 'Founded in 2018, Comic Art Studio emerged from a conviction that modern digital interfaces had succumbed to disposable SaaS visual formulas, homogenized component libraries, and visual noise. With over eight years of international practice, our partners approach digital architecture with the same material gravity, tactile inertia, and editorial permanence as stone, steel, and light.', 
 'To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity.', 
 'A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status.', 
 'We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate.', 
 '[{"label":"Clients Served","value":"82"},{"label":"Projects Delivered","value":"120"},{"label":"Countries","value":"14"},{"label":"Design Awards","value":"6"}]', 
 '["Sequential Storytelling","Bespoke Inking","Architectural UI","Physical Motion","Titanium Craft","Obsidian Aesthetics"]', 
 'Initiate Your Commission', 
 'Partner with our studio to engineer a bespoke digital monument tailored to your brand architecture.', 
 'Connect with Atelier', '/contact');

-- ------------------------------------------------------------------------------
-- 5. STUDIO PAGE CONTENT & METRICS
-- ------------------------------------------------------------------------------

CREATE TABLE `studio_page` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `intro_heading` VARCHAR(255) NOT NULL,
  `intro_subtitle` TEXT NOT NULL,
  `story_heading` VARCHAR(255) NOT NULL,
  `story_content` LONGTEXT NOT NULL,
  `stats_cards` LONGTEXT NOT NULL,
  `value_cards` LONGTEXT NOT NULL,
  `hover_images_json` LONGTEXT NULL,
  `show_comic_panel` TINYINT(1) DEFAULT 1,
  `show_counter` TINYINT(1) DEFAULT 1,
  `cta_heading` VARCHAR(255) NOT NULL,
  `cta_description` TEXT NOT NULL,
  `cta_button_text` VARCHAR(100) NOT NULL,
  `cta_button_url` VARCHAR(255) NOT NULL,
  `show_cta` TINYINT(1) DEFAULT 1,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `studio_page` (`id`, `intro_heading`, `intro_subtitle`, `story_heading`, `story_content`, `stats_cards`, `value_cards`, `hover_images_json`, `show_comic_panel`, `show_counter`, `cta_heading`, `cta_description`, `cta_button_text`, `cta_button_url`, `show_cta`) VALUES
(1, 
 'Engineering digital monuments with architectural discipline.', 
 'Comic Art Studio operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.', 
 'The Origin & Craft', 
 'Founded in 2018, Comic Art Studio emerged from a conviction that modern digital interfaces had succumbed to disposable SaaS visual formulas, homogenized component libraries, and visual noise. With over eight years of international practice, our partners approach digital architecture with the same material gravity, tactile inertia, and editorial permanence as stone, steel, and light.', 
 '[{"id":"1","title":"Clients Served","value":"82","images":[]},{"id":"2","title":"Projects Delivered","value":"120","images":[]},{"id":"3","title":"Countries","value":"14","images":[]},{"id":"4","title":"Awards","value":"6","images":[]}]', 
 '[{"id":"1","title":"Mission","description":"To strip away superfluous digital decoration and build quiet, high-contrast digital monuments that command immediate respect and lasting clarity."},{"id":"2","title":"Vision","description":"A web ecosystem where interactive architecture exhibits physical weight, tactile responsiveness, and editorial craftsmanship worthy of museum archival status."},{"id":"3","title":"Philosophy","description":"We treat layout margins, typographic scale ratios, and animation inertia curves as mathematical laws, ensuring every interface feels bespoke and deliberate."}]', 
 '["/uploads/studio/hover-1.jpg","/uploads/studio/hover-2.jpg","/uploads/studio/hover-3.jpg"]', 
 1, 1, 
 'You\'ve seen how we think. Now explore what we\'ve built.', 
 'Examine our curated archive of interactive monuments, physical artefacts, and digital brand architecture.', 
 'Explore Selected Projects', '/projects', 1);

-- ------------------------------------------------------------------------------
-- 6. PORTFOLIO PROJECTS
-- ------------------------------------------------------------------------------

CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Digital Architecture',
  `client` VARCHAR(191) NULL,
  `year` VARCHAR(20) NOT NULL DEFAULT '2026',
  `tagline` VARCHAR(255) NULL,
  `summary` TEXT NULL,
  `description` LONGTEXT NULL,
  `full_case_study` LONGTEXT NULL,
  `cover_image` TEXT NULL,
  `image_url` TEXT NULL,
  `grid_span` VARCHAR(100) DEFAULT 'col-span-12 md:col-span-6',
  `aspect_ratio` VARCHAR(50) DEFAULT 'aspect-[4/3]',
  `tools_used` LONGTEXT NULL,
  `gallery_images` LONGTEXT NULL,
  `gallery_json` LONGTEXT NULL,
  `video_url` TEXT NULL,
  `live_url` TEXT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `status` ENUM('published', 'draft', 'archived') DEFAULT 'published',
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `projects` (`id`, `title`, `slug`, `category`, `client`, `year`, `tagline`, `summary`, `description`, `full_case_study`, `cover_image`, `image_url`, `grid_span`, `aspect_ratio`, `tools_used`, `gallery_images`, `is_featured`, `is_published`, `status`, `sort_order`) VALUES
(1, 'CHRONO: Cyberpunk Sequential Graphic Novel', 'chrono-cyberpunk-graphic-novel', 'Graphic Novel & Digital', 'Cyberpunk Atelier', '2026', 'A 240-page hardcover graphic novel and interactive companion app.', 'Complete sequential art production, character design, and interactive web gallery for a dystopian comic.', 'Comprehensive comic production featuring high-contrast ink shaders, custom typography, and physical foil-stamped hardcovers.', '<h2>CHRONO Graphic Novel Project Overview</h2><p>CHRONO represents 18 months of intensive sequential illustration and world-building. Designed as a high-contrast ink masterpiece, every page balances dark obsidian blacks with vibrant neon accent lines.</p><h3>Key Deliverables</h3><ul><li>240 Pages of Full-Color Sequential Art</li><li>Interactive Web Companion App with Animated Panels</li><li>Custom Collector\'s Edition Box Set</li></ul>', '/assets/images/project_artwork_1_1785513185877.jpg', '/assets/images/project_artwork_1_1785513185877.jpg', 'col-span-12 md:col-span-6', 'aspect-[4/3]', '["Clip Studio Paint Ex","Adobe Photoshop","WebGL Shaders","Tailwind CSS"]', '["/assets/images/project_artwork_1_1785513185877.jpg","/assets/images/hero_nebula_bg_1785513204720.jpg"]', 1, 1, 'published', 1),

(2, 'NEBULA ARCHIVES: Interactive Manga Reader Engine', 'nebula-archives-manga-reader', 'Digital Platform', 'Tokyo Media Corp', '2026', 'High-performance WebGL & Canvas manga reader platform.', 'Custom web reader supporting infinite vertical scroll, panel zoom, and offline reading caching.', 'Engineered for optimal reader immersion with lightning-fast image streaming and zero-layout-shift panel rendering.', '<h2>NEBULA Manga Platform Case Study</h2><p>Designed for millions of monthly comic readers, NEBULA delivers sub-100ms page transitions and crisp vector font rendering across mobile and desktop devices.</p>', '/assets/images/hero_nebula_bg_1785513204720.jpg', '/assets/images/hero_nebula_bg_1785513204720.jpg', 'col-span-12 md:col-span-6', 'aspect-[4/3]', '["React","TypeScript","Canvas API","Tailwind CSS"]', '["/assets/images/hero_nebula_bg_1785513204720.jpg","/assets/images/project_artwork_2_1785513204720.jpg"]', 1, 1, 'published', 2),

(3, 'TITANIUM EDITION: Collector Hardcover Artbook', 'titanium-edition-artbook', 'Print Architecture', 'Vance Publishing', '2025', 'Bespoke physical artbook bound in brushed metal foil.', 'Physical print design and layout typography for a limited-run concept art collection.', 'Combining heavy 200gsm archival paper with metallic foil stamping and laser-etched titanium endpapers.', '<h2>TITANIUM Edition Print Craftsmanship</h2><p>A masterclass in tactile physical publishing. Each copy features hand-numbered spine stamps and custom foil-embossed slipcases.</p>', '/assets/images/project_artwork_2_1785513204720.jpg', '/assets/images/project_artwork_2_1785513204720.jpg', 'col-span-12 md:col-span-6', 'aspect-[4/3]', '["Adobe InDesign","Adobe Illustrator","Physical Foil Stamping"]', '["/assets/images/project_artwork_2_1785513204720.jpg","/assets/images/project_artwork_3_1785513218624.jpg"]', 0, 1, 'published', 3),

(4, 'OBSIDIAN SPATIAL: Architectural Portfolio Web System', 'obsidian-spatial-portfolio', 'Web Systems', 'Kuroda Architecture', '2025', 'Ultra-minimalist editorial web experience for luxury architects.', 'Dark mode website featuring tactile micro-interactions and smooth page inertia.', 'Designed around mathematical typographic ratios and strict structural grid alignment.', '<h2>OBSIDIAN Web System</h2><p>Built with React and Tailwind CSS, giving visitors an immersive editorial experience without unnecessary visual noise.</p>', '/assets/images/project_artwork_3_1785513218624.jpg', '/assets/images/project_artwork_3_1785513218624.jpg', 'col-span-12 md:col-span-6', 'aspect-[4/3]', '["React","Motion / Framer","Tailwind CSS","Express"]', '["/assets/images/project_artwork_3_1785513218624.jpg"]', 0, 1, 'published', 4);

-- ------------------------------------------------------------------------------
-- 7. BLOG CATEGORIES, POSTS & PAGE SETTINGS
-- ------------------------------------------------------------------------------

CREATE TABLE `blog_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Design Philosophy', 'design-philosophy', 'Essays on structural line weight, visual inertia, and material permanence.'),
(2, 'Conceptual Methodology', 'conceptual-methodology', 'Technical frameworks translating comic panel pacing into digital UI.'),
(3, 'Brand Architecture', 'brand-architecture', 'Perspectives on bespoke craftsmanship vs disposable web templates.'),
(4, 'Physical & Spatial Craft', 'physical-spatial-craft', 'Studies on physical artbooks, tactile print stocks, and metallic foils.');

CREATE TABLE `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Design Philosophy',
  `category_id` INT NULL,
  `category_name` VARCHAR(100) NULL,
  `author_name` VARCHAR(100) DEFAULT 'Evelyn Kuroda',
  `author_role` VARCHAR(100) DEFAULT 'Design Partner',
  `author_id` INT NULL,
  `cover_image` TEXT NULL,
  `read_time` VARCHAR(20) DEFAULT '7 min read',
  `view_count` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `status` ENUM('published', 'draft', 'archived') DEFAULT 'published',
  `published_at` VARCHAR(50) NULL,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `keywords` TEXT NULL,
  `tags` LONGTEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `category`, `category_id`, `category_name`, `author_name`, `author_role`, `cover_image`, `read_time`, `view_count`, `is_featured`, `is_published`, `status`, `published_at`, `meta_title`, `meta_description`, `keywords`, `tags`) VALUES
(1, 
 'Architectural Inertia in Digital Interfaces: Beyond Disposable SaaS Aesthetics', 
 'architectural-inertia-in-digital-interfaces', 
 'Why modern interactive architecture must abandon ephemeral glassmorphism and spring physics in favor of material mass, tactile friction, and structural weight that lasts across decades.', 
 '<h2>The Philosophy of Mass and Weight</h2><p>Modern interactive design has reached a point of visual homogenization. Ephemeral drop shadows, soft pastel gradients, and generic UI components dominate web applications. At Comic Art Studio, we believe visual interfaces should possess narrative inertia—a tactile sense of physical weight and structural permanence.</p><p>Sequential art and comic design teach us that every frame, gutter, and stroke carries intentional weight. When applied to digital systems, this mindset shifts UI design from temporary skinning to architectural drafting.</p><blockquote>"Visual weight isn\'t merely cosmetic; it creates spatial hierarchy and guides human focus with unyielding clarity."</blockquote><h3>Principles of Structural Inking</h3><ul><li>High contrast line work with deliberate weight distribution</li><li>Clear paneling and gutter grid alignment</li><li>Editorial typography paired with expressive character dynamics</li></ul><p>By treating layout margins, typographic ratios, and panel transitions as physical constraints, digital products transcend temporary visual trends and become timeless brand monuments.</p>', 
 'Design Philosophy', 1, 'Design Philosophy', 'Evelyn Kuroda', 'Design Partner', 
 '/assets/images/hero_nebula_bg_1785513204720.jpg', '7 min read', 540, 1, 1, 'published', '2026-07-28', 
 'Architectural Inertia in Digital Interfaces | Comic Art Studio', 
 'Explore why modern digital architecture must favor material mass, tactile friction, and structural weight.', 
 'comic design, sequential art, UI architecture, digital permanence', 
 '["Design","Sequential Art","Architecture"]'),

(2, 
 'Sequential Manga Panels as UI Storyboarding Frameworks', 
 'sequential-manga-panels-as-ui-storyboarding-frameworks', 
 'Translating Japanese manga panel pacing, gutter tension, and high-contrast ink techniques into high-conversion digital narrative arcs.', 
 '<h2>Translating Manga Paneling to Digital User Journeys</h2><p>Manga artists have perfected the art of guiding the reader\'s gaze across dense visual information. Through strategic variation in panel size, angle, and gutter spacing, sequential storytellers control emotion, suspense, and comprehension.</p><p>In digital interface design, user journeys follow identical principles. A landing page is not a disconnected series of cards—it is a continuous sequential narrative.</p><h3>Key Techniques</h3><ul><li><strong>Panel Hierarchy:</strong> Establishing primary hero visuals that establish setting before zooming into detailed features.</li><li><strong>Gutter Tension:</strong> Utilizing whitespace between sections to create natural cognitive breathing room.</li><li><strong>Speed Lines & Inking:</strong> Using subtle motion lines to draw attention toward key calls to action.</li></ul><p>By structuring digital layouts like serialized manga pages, user engagement increases dramatically as visitors naturally flow through the storytelling grid.</p>', 
 'Conceptual Methodology', 2, 'Conceptual Methodology', 'Kenji Sato', 'Lead Comic Artist', 
 '/assets/images/project_artwork_1_1785513185877.jpg', '8 min read', 382, 0, 1, 'published', '2026-07-14', 
 'Sequential Manga Panels as UI Frameworks | Comic Art Studio', 
 'Translating Japanese manga panel pacing and ink techniques into digital narrative arcs.', 
 'manga panels, UI storyboarding, sequential storytelling', 
 '["Manga","UI Design","Storyboarding"]'),

(3, 
 'The Death of Disposable Web Templates', 
 'the-death-of-disposable-web-templates', 
 'How homogenized AI generators are driving visionary founders back toward bespoke editorial typography, custom shader physics, and physical brand monuments.', 
 '<h2>The Counter-Revolution of Craft</h2><p>As automated website builders make basic web pages trivial to generate, generic templates lose all value. When every website looks like the same pre-built template, distinct visual identity becomes the ultimate competitive advantage.</p><p>Forward-thinking founders and creators are seeking bespoke craftsmanship—custom character art, hand-drawn illustration systems, unique typographic pairings, and deliberate interactive transitions.</p><h3>Why Bespoke Comic & Narrative Craft Wins</h3><ul><li>Instant brand recognition through unique visual language</li><li>Emotional connection forged by custom character art</li><li>High durability and distinction against cookie-cutter platforms</li></ul>', 
 'Brand Architecture', 3, 'Brand Architecture', 'Marcus Vance', 'Creative Director', 
 '/assets/images/project_artwork_2_1785513204720.jpg', '5 min read', 290, 0, 1, 'published', '2026-06-29', 
 'The Death of Disposable Web Templates | Comic Art Studio', 
 'Why visionary founders are moving away from generic templates toward custom narrative craft.', 
 'web design, brand architecture, custom illustration, comic art', 
 '["Branding","Craftsmanship","Design Trends"]'),

(4, 
 'Obsidian & Titanium: Materials of Digital Permanence', 
 'obsidian-and-titanium-materials-of-digital-permanence', 
 'A study on physical craftsmanship, tactile hardware interfaces, and spatial acoustic pavilions constructed for high-net-worth archives.', 
 '<h2>Bridging Physical Craft and Digital Narratives</h2><p>Physical printing of graphic novels and art books demands extreme attention to paper stock, ink viscosity, foil stamping, and binding durability. Bringing this same obsession to digital design creates experiences that feel physical, solid, and enduring.</p><p>We explore how high-contrast dark palettes, tactile micro-interactions, and heavy editorial typography create a sense of digital permanence akin to dark obsidian and brushed titanium.</p>', 
 'Physical & Spatial Craft', 4, 'Physical & Spatial Craft', 'Julian Thorne', 'Art Director', 
 '/assets/images/project_artwork_3_1785513218624.jpg', '6 min read', 215, 0, 1, 'published', '2026-06-11', 
 'Obsidian & Titanium: Materials of Digital Permanence | Comic Art Studio', 
 'A study on physical craftsmanship and material permanence in digital interfaces.', 
 'digital permanence, visual craft, design theory', 
 '["Craft","Materials","Visual Arts"]');

CREATE TABLE `blog_page_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `page_title` VARCHAR(255) NOT NULL DEFAULT 'Editorial Archives & Essays',
  `page_subtitle` TEXT NOT NULL,
  `subscribe_heading` VARCHAR(255) NOT NULL DEFAULT 'Subscribe to Our Dispatch',
  `subscribe_text` TEXT NOT NULL,
  `external_subscribe_url` VARCHAR(255) NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blog_page_settings` (`id`, `page_title`, `page_subtitle`, `subscribe_heading`, `subscribe_text`, `external_subscribe_url`) VALUES
(1, 
 'Editorial Archives & Essays', 
 'Manifestos, technical essays, sequential art studies, and spatial design perspectives from our atelier.', 
 'Join the Atelier Dispatch', 
 'Receive quarterly essays on sequential design, digital permanence, and physical artbook production.', 
 'https://substack.com');

-- ------------------------------------------------------------------------------
-- 8. CONTACT PAGE & FORM BUILDER SYSTEM
-- ------------------------------------------------------------------------------

CREATE TABLE `contact_page_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `hero_image_path` TEXT NOT NULL,
  `overlay_heading` VARCHAR(255) NOT NULL,
  `overlay_description` TEXT NOT NULL,
  `form_heading` VARCHAR(255) NOT NULL,
  `form_description` TEXT NOT NULL,
  `form_button_text` VARCHAR(100) NOT NULL,
  `social_links_json` LONGTEXT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contact_page_settings` (`id`, `hero_image_path`, `overlay_heading`, `overlay_description`, `form_heading`, `form_description`, `form_button_text`, `social_links_json`) VALUES
(1, 
 '/assets/images/hero_nebula_bg_1785513204720.jpg', 
 'Initiate Commission', 
 'Connect directly with our creative directors to discuss graphic novel production, comic art commissions, or digital architecture.', 
 'Start a Conversation', 
 'Please complete the inquiry details below. Our team reviews all submissions within 24–48 hours.', 
 'Submit Inquiry', 
 '[{"platform":"Twitter","url":"https://twitter.com"},{"platform":"Instagram","url":"https://instagram.com"},{"platform":"LinkedIn","url":"https://linkedin.com"},{"platform":"GitHub","url":"https://github.com"}]');

CREATE TABLE `forms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `fields_json` LONGTEXT NOT NULL,
  `recipient_email` VARCHAR(191) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `forms` (`id`, `name`, `slug`, `fields_json`, `recipient_email`) VALUES
(1, 
 'Commission Inquiry Form', 
 'inquiry-form', 
 '[{"name":"full_name","label":"Full Name","placeholder":"e.g. Evelyn Kuroda","type":"text","required":true,"order":1},{"name":"email","label":"Email Address","placeholder":"e.g. evelyn@atelier.com","type":"email","required":true,"order":2},{"name":"project_type","label":"Commission Category","placeholder":"Select category","type":"select","required":true,"order":3},{"name":"budget_range","label":"Target Budget / Scale","placeholder":"e.g. $25,000 - $50,000","type":"text","required":false,"order":4},{"name":"message","label":"Project Narrative & Requirements","placeholder":"Describe your vision, scope, and timeline...","type":"textarea","required":true,"order":5}]', 
 'sam@airsoftcomics.com');

CREATE TABLE `form_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` INT NOT NULL,
  `data_json` LONGTEXT NOT NULL,
  `submission_data` LONGTEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `status` ENUM('new', 'read', 'archived') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `form_submissions` (`id`, `form_id`, `data_json`, `submission_data`, `ip_address`, `status`, `created_at`) VALUES
(1, 1, '{"full_name":"Marcus Vance","email":"marcus@cyberpunk.io","project_type":"Graphic Novel Production","budget_range":"$50,000+","message":"We are looking for a complete 120-page comic book production team with digital reader web application."}', '{"full_name":"Marcus Vance","email":"marcus@cyberpunk.io","project_type":"Graphic Novel Production","budget_range":"$50,000+","message":"We are looking for a complete 120-page comic book production team with digital reader web application."}', '192.168.1.100', 'new', '2026-08-01 10:15:00'),
(2, 1, '{"full_name":"Elena Rostova","email":"elena@spatial-arch.com","project_type":"Digital Web Architecture","budget_range":"$30,000 - $50,000","message":"Interested in a luxury architectural portfolio website with custom shader animations and CMS controls."}', '{"full_name":"Elena Rostova","email":"elena@spatial-arch.com","project_type":"Digital Web Architecture","budget_range":"$30,000 - $50,000","message":"Interested in a luxury architectural portfolio website with custom shader animations and CMS controls."}', '192.168.1.105', 'read', '2026-08-03 14:30:00');

-- ------------------------------------------------------------------------------
-- 9. CENTRAL MEDIA LIBRARY (UPLOADS SYSTEM)
-- ------------------------------------------------------------------------------
-- Rule: All image/media uploads are placed into one directory: /uploads
-- Database stores: /uploads/image-name.jpg

CREATE TABLE `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL,
  `file_path` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'general',
  `folder` VARCHAR(100) DEFAULT 'general',
  `uploaded_by` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `file_name` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` TEXT NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL,
  `folder` VARCHAR(100) DEFAULT 'general',
  `uploaded_by` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `media_library` (`id`, `filename`, `original_name`, `mime_type`, `file_size`, `file_path`, `category`, `folder`, `uploaded_by`) VALUES
(1, 'hero_nebula_bg_1785513204720.jpg', 'hero_nebula_bg.jpg', 'image/jpeg', 485120, '/uploads/hero_nebula_bg_1785513204720.jpg', 'hero', 'general', 1),
(2, 'project_artwork_1_1785513185877.jpg', 'chrono_cover.jpg', 'image/jpeg', 612400, '/uploads/project_artwork_1_1785513185877.jpg', 'portfolio', 'general', 1),
(3, 'project_artwork_2_1785513204720.jpg', 'titanium_artbook.jpg', 'image/jpeg', 532100, '/uploads/project_artwork_2_1785513204720.jpg', 'portfolio', 'general', 1),
(4, 'project_artwork_3_1785513218624.jpg', 'obsidian_spatial.jpg', 'image/jpeg', 598300, '/uploads/project_artwork_3_1785513218624.jpg', 'portfolio', 'general', 1);

INSERT INTO `media` (`id`, `file_name`, `original_name`, `file_path`, `mime_type`, `file_size`, `folder`, `uploaded_by`) VALUES
(1, 'hero_nebula_bg_1785513204720.jpg', 'hero_nebula_bg.jpg', '/uploads/hero_nebula_bg_1785513204720.jpg', 'image/jpeg', 485120, 'general', 1),
(2, 'project_artwork_1_1785513185877.jpg', 'chrono_cover.jpg', '/uploads/project_artwork_1_1785513185877.jpg', 'image/jpeg', 612400, 'general', 1);

-- ------------------------------------------------------------------------------
-- 10. SEO MANAGEMENT TABLE
-- ------------------------------------------------------------------------------

CREATE TABLE `seo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(100) NOT NULL UNIQUE,
  `meta_title` VARCHAR(255) NOT NULL,
  `meta_description` TEXT NOT NULL,
  `keywords` TEXT NULL,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image_url` TEXT NULL,
  `canonical_url` VARCHAR(255) NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `seo_settings` (`page_key`, `meta_title`, `meta_description`, `keywords`, `og_title`, `og_description`, `og_image_url`, `canonical_url`) VALUES
('global', 'Comic Art Studio — High-Performance Motion Architecture & Digital Systems', 'Comic Art Studio operates as an independent design laboratory bridging physical motion architecture, sequential art, and high-performance digital systems.', 'comic art studio, motion architecture, sequential art, digital monuments', 'Comic Art Studio — High-Performance Digital Systems', 'Independent design laboratory engineering digital monuments with architectural discipline.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', 'https://kinetic-studio.com'),
('homepage', 'Comic Art Studio | Kinetic Motion & Digital Architecture', 'Welcome to Comic Art Studio. We build bespoke digital spaces, graphic novels, and motion systems.', 'comic studio, motion design, graphic novel web, luxury digital', 'Comic Art Studio | Home', 'Explore our latest motion architecture and graphic novel projects.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('studio', 'Studio & Laboratory — Comic Art Studio', 'Our design philosophy, laboratory practices, sequential art, and creative team.', 'studio philosophy, kinetic laboratory, spatial typography, comic atelier', 'Studio & Laboratory — Comic Art Studio', 'Engineering digital monuments with architectural discipline.', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop', NULL),
('projects', 'Selected Projects & Portfolio — Comic Art Studio', 'Explore selected graphic novels, digital platforms, and architectural case studies.', 'portfolio, graphic novel projects, case studies, digital monuments', 'Selected Projects — Comic Art Studio', 'Explore selected graphic novels and architectural case studies.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('blog', 'Editorial Archives & Essays — Comic Art Studio', 'Manifestos, technical essays, sequential art studies, and spatial design perspectives.', 'blog, essays, sequential art, spatial typography, design manifesto', 'Editorial Archives — Comic Art Studio', 'Manifestos, technical essays, and sequential art perspectives.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('contact', 'Initiate Commission — Comic Art Studio Contact', 'Connect with Comic Art Studio for high-impact spatial design, graphic novels, and digital commissions.', 'contact, commission, hire comic art studio, inquiry', 'Initiate Commission — Comic Art Studio', 'Connect with Comic Art Studio for high-impact comic art and digital commissions.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL);

-- ------------------------------------------------------------------------------
-- 11. SMTP & EMAIL CONFIGURATION
-- ------------------------------------------------------------------------------

CREATE TABLE `smtp_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `host` VARCHAR(191) NOT NULL,
  `port` INT NOT NULL DEFAULT 465,
  `username` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NULL,
  `from_email` VARCHAR(191) NOT NULL,
  `from_name` VARCHAR(191) NOT NULL,
  `encryption` ENUM('ssl', 'tls', 'none') DEFAULT 'ssl',
  `is_active` TINYINT(1) DEFAULT 1,
  `auto_reply_subject` VARCHAR(255) NULL,
  `auto_reply_body` TEXT NULL,
  `notification_email` VARCHAR(191) NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `smtp_settings` (`id`, `host`, `port`, `username`, `password`, `from_email`, `from_name`, `encryption`, `is_active`, `auto_reply_subject`, `auto_reply_body`, `notification_email`) VALUES
(1, 'smtp.hostinger.com', 465, 'sam@airsoftcomics.com', 'ProductDesigner@2022', 'sam@airsoftcomics.com', 'Comic Art Studio', 'ssl', 1, 
 'Thank you for your commission inquiry — Comic Art Studio', 
 'We have received your commission inquiry. Our creative directors will review your project details and respond within 24–48 hours.', 
 'sam@airsoftcomics.com');

-- ------------------------------------------------------------------------------
-- 12. AUDIT LOGS & ANALYTICS EVENTS
-- ------------------------------------------------------------------------------

CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `user_name` VARCHAR(100) NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(100) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_logs` (`id`, `user_id`, `user_name`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`) VALUES
(1, 1, 'Super Admin', 'SYSTEM_INITIALIZATION', 'Database', 'schema.sql', 'Complete production schema initialized with seed data.', '127.0.0.1');

CREATE TABLE `analytics_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_type` VARCHAR(50) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `referrer` TEXT NULL,
  `user_agent` TEXT NULL,
  `device_category` VARCHAR(50) NULL,
  `country_code` VARCHAR(10) NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `analytics_events` (`id`, `event_type`, `path`, `device_category`, `country_code`, `ip_address`) VALUES
(1, 'page_view', '/', 'desktop', 'US', '192.168.1.1'),
(2, 'page_view', '/projects', 'desktop', 'US', '192.168.1.1'),
(3, 'page_view', '/studio', 'mobile', 'JP', '192.168.1.2');

-- ==============================================================================
-- END OF SCHEMA SCRIPT
-- ==============================================================================
