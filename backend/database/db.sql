-- ========================================================
-- KINETIC CMS — FULL PRODUCTION DATABASE SCHEMA (db.sql)
-- Designed for MySQL 8.0 / MariaDB (phpMyAdmin Compatible)
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `analytics_events`;
DROP TABLE IF EXISTS `seo_settings`;
DROP TABLE IF EXISTS `smtp_settings`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `form_submissions`;
DROP TABLE IF EXISTS `forms`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `studio_sections`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `roles`;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table: roles
-- --------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Super Admin', 'Full control over system settings, users, CMS, and configurations.'),
(2, 'Admin', 'Control over CMS content, media, SEO, forms, and analytics.'),
(3, 'Editor', 'Control over blogs, projects, and media uploads.');

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
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

-- Default password is 'Admin@2026!' hashed with bcrypt
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role_id`, `is_active`) VALUES
(1, 'admin@kinetic-studio.com', '$2b$10$f3D2/i9Vv6w4R9T1k5r8/.uM3q.4Z1i7dG5L7r5N2k8M3O1P4q6S6', 'Super', 'Admin', 1, 1),
(2, 'editor@kinetic-studio.com', '$2b$10$f3D2/i9Vv6w4R9T1k5r8/.uM3q.4Z1i7dG5L7r5N2k8M3O1P4q6S6', 'Creative', 'Editor', 3, 1);

-- --------------------------------------------------------
-- Table: user_sessions
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table: projects
-- --------------------------------------------------------
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `tagline` VARCHAR(255) NULL,
  `summary` TEXT NULL,
  `description` LONGTEXT NULL,
  `client` VARCHAR(191) NULL,
  `location` VARCHAR(191) NULL,
  `cover_image` TEXT NULL,
  `gallery_json` LONGTEXT NULL,
  `video_url` TEXT NULL,
  `live_url` TEXT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('published', 'draft', 'archived') DEFAULT 'published',
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: blog_posts
-- --------------------------------------------------------
CREATE TABLE `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `excerpt` TEXT NULL,
  `content` LONGTEXT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Essay',
  `author_name` VARCHAR(100) DEFAULT 'KINETIC Atelier',
  `cover_image` TEXT NULL,
  `read_time` VARCHAR(20) DEFAULT '5 min',
  `is_featured` TINYINT(1) DEFAULT 0,
  `status` ENUM('published', 'draft', 'archived') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: media
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table: forms & form_submissions
-- --------------------------------------------------------
CREATE TABLE `forms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `fields_json` LONGTEXT NOT NULL,
  `recipient_email` VARCHAR(191) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `forms` (`id`, `name`, `slug`, `fields_json`, `recipient_email`) VALUES
(1, 'Inquiry Form', 'inquiry-form', '[{"name":"full_name","type":"text","required":true},{"name":"email","type":"email","required":true},{"name":"project_type","type":"select","required":true},{"name":"budget_range","type":"text","required":false},{"name":"message","type":"textarea","required":true}]', 'commissions@kinetic-studio.com');

CREATE TABLE `form_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` INT NOT NULL,
  `submission_data` LONGTEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `status` ENUM('new', 'read', 'archived') DEFAULT 'new',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: settings
-- --------------------------------------------------------
CREATE TABLE `settings` (
  `key_name` VARCHAR(191) PRIMARY KEY,
  `value` LONGTEXT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`key_name`, `value`, `category`) VALUES
('site_name', 'KINETIC', 'general'),
('company_name', 'KINETIC Studio Ltd.', 'general'),
('email', 'hello@kinetic-studio.com', 'general'),
('phone', '+1 (800) 555-0199', 'general'),
('address', '100 Architectural Way, Studio District, CA 90210', 'general'),
('copyright_text', '© 2026 KINETIC Studio Ltd. All rights reserved.', 'general'),
('footer_info', 'An independent creative studio engineering brand architecture, bespoke digital monuments, and physical motion design.', 'general'),
('designer_credit', 'KINETIC Atelier', 'general'),
('designer_url', 'https://kinetic-studio.com', 'general'),
('white_logo', '/uploads/logos/kinetic-white.svg', 'assets'),
('black_logo', '/uploads/logos/kinetic-black.svg', 'assets'),
('favicon', '/favicon.ico', 'assets'),
('social_twitter', 'https://twitter.com', 'social'),
('social_instagram', 'https://instagram.com', 'social'),
('social_linkedin', 'https://linkedin.com', 'social'),
('social_github', 'https://github.com', 'social'),
('theme_primary', '#0097FF', 'theme'),
('theme_button', '#0097FF', 'theme'),
('theme_accent', '#E6A800', 'theme'),
('theme_heading', '#FFFFFF', 'theme'),
('theme_body', '#9A9A9E', 'theme'),
('theme_bg', '#050505', 'theme');

-- --------------------------------------------------------
-- Table: seo_settings
-- --------------------------------------------------------
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
('global', 'KINETIC — High-Performance Motion Architecture & Digital Systems', 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.', 'motion architecture, digital studio, design laboratory, kinetic systems', 'KINETIC — High-Performance Digital Systems', 'Independent design laboratory engineering digital monuments with architectural discipline.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', 'https://kinetic.studio'),
('homepage', 'KINETIC | Kinetic Motion & Digital Architecture', 'Welcome to KINETIC. We build bespoke digital spaces and motion systems.', 'kinetic, motion design, architectural web, luxury digital', 'KINETIC | Home', 'Explore our latest motion architecture and kinetic studio projects.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('studio', 'Studio & Laboratory — KINETIC', 'Our design philosophy, laboratory practices, and kinetic team.', 'studio philosophy, kinetic laboratory, spatial typography', 'Studio & Laboratory — KINETIC', 'Engineering digital monuments with architectural discipline.', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop', NULL),
('projects', 'Selected Projects & Portfolio — KINETIC', 'Explore selected architectural digital projects and case studies.', 'portfolio, architectural projects, case studies, digital monuments', 'Selected Projects — KINETIC', 'Explore selected architectural digital projects and case studies.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('blog', 'Editorial Archives & Essays — KINETIC', 'Manifestos, technical essays, and spatial design perspectives.', 'blog, essays, spatial typography, design manifesto', 'Editorial Archives — KINETIC', 'Manifestos, technical essays, and spatial design perspectives.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL),
('contact', 'Initiate Commission — KINETIC Contact', 'Connect with KINETIC for high-impact spatial design and digital commissions.', 'contact, commission, hire kinetic studio, inquiry', 'Initiate Commission — KINETIC', 'Connect with KINETIC for high-impact spatial design and digital commissions.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop', NULL);

-- --------------------------------------------------------
-- Table: smtp_settings
-- --------------------------------------------------------
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
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `smtp_settings` (`id`, `host`, `port`, `username`, `from_email`, `from_name`, `encryption`, `is_active`) VALUES
(1, 'smtp.hostinger.com', 465, 'contact@kinetic-studio.com', 'contact@kinetic-studio.com', 'KINETIC Studio', 'ssl', 1);

-- --------------------------------------------------------
-- Table: activity_logs
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table: analytics_events
-- --------------------------------------------------------
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
