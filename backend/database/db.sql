-- KINETIC CMS Database Schema (MySQL 8.0+)
-- Complete schema for Hostinger / phpMyAdmin Deployment

CREATE DATABASE IF NOT EXISTS `kinetic_cms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kinetic_cms`;

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ROLE_PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role_id` INT NOT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `refresh_token` VARCHAR(500) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_sessions_user` (`user_id`),
  INDEX `idx_sessions_token` (`refresh_token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SITE_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` LONGTEXT DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'general',
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_settings_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. GLOBAL_VARIABLES TABLE
CREATE TABLE IF NOT EXISTS `global_variables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `var_key` VARCHAR(100) NOT NULL UNIQUE,
  `var_value` LONGTEXT DEFAULT NULL,
  `var_type` VARCHAR(30) DEFAULT 'string',
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. HOMEPAGE_SECTIONS TABLE
CREATE TABLE IF NOT EXISTS `homepage_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_key` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) DEFAULT NULL,
  `subtitle` TEXT DEFAULT NULL,
  `content_json` LONGTEXT DEFAULT NULL,
  `is_enabled` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. STUDIO_PAGE TABLE
CREATE TABLE IF NOT EXISTS `studio_page` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hero_title` VARCHAR(255) DEFAULT NULL,
  `hero_subtitle` TEXT DEFAULT NULL,
  `philosophy_content` LONGTEXT DEFAULT NULL,
  `metrics_json` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `client` VARCHAR(150) NOT NULL,
  `year` VARCHAR(20) NOT NULL,
  `grid_span` VARCHAR(100) DEFAULT 'col-span-12 md:col-span-6',
  `aspect_ratio` VARCHAR(50) DEFAULT 'aspect-[4/3]',
  `description` TEXT DEFAULT NULL,
  `full_case_study` LONGTEXT DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_slug` (`slug`),
  INDEX `idx_projects_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. PROJECT_GALLERY TABLE
CREATE TABLE IF NOT EXISTS `project_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BLOG_CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. BLOG_TAGS TABLE
CREATE TABLE IF NOT EXISTS `blog_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. BLOG_POSTS TABLE
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `author_id` INT DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 0,
  `published_at` DATETIME DEFAULT NULL,
  `view_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. BLOG_POST_TAGS TABLE
CREATE TABLE IF NOT EXISTS `blog_post_tags` (
  `post_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. MEDIA_LIBRARY TABLE
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `file_size` INT NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'general',
  `uploaded_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. MENUS TABLE
CREATE TABLE IF NOT EXISTS `menus` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(100) NOT NULL UNIQUE,
  `items_json` LONGTEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. FORMS TABLE
CREATE TABLE IF NOT EXISTS `forms` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_name` VARCHAR(100) NOT NULL,
  `form_key` VARCHAR(100) NOT NULL UNIQUE,
  `fields_json` LONGTEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. FORM_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS `form_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` INT NOT NULL,
  `data_json` LONGTEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`form_id`) REFERENCES `forms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. SMTP_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `smtp_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `host` VARCHAR(255) NOT NULL,
  `port` INT NOT NULL DEFAULT 465,
  `username` VARCHAR(255) DEFAULT NULL,
  `password_encrypted` VARCHAR(500) DEFAULT NULL,
  `from_email` VARCHAR(255) NOT NULL,
  `from_name` VARCHAR(255) DEFAULT 'KINETIC Studio',
  `encryption` VARCHAR(20) DEFAULT 'ssl',
  `is_active` TINYINT(1) DEFAULT 1,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. SEO_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS `seo_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(100) NOT NULL UNIQUE,
  `meta_title` VARCHAR(255) NOT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `og_image_url` VARCHAR(500) DEFAULT NULL,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `structured_data_json` LONGTEXT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS `analytics` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page_url` VARCHAR(500) NOT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `visitor_ip` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_analytics_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. ACTIVITY_LOGS TABLE
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_table` VARCHAR(100) DEFAULT NULL,
  `target_id` INT DEFAULT NULL,
  `details_json` LONGTEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Insert Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'Super Admin', 'Full system control, user management, and security configurations'),
(2, 'Admin', 'Can edit all content, manage projects, blog posts, and forms'),
(3, 'Editor', 'Can create and publish blog posts and project gallery entries')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- Insert Permissions
INSERT INTO `permissions` (`id`, `name`, `module`, `description`) VALUES
(1, 'users.manage', 'users', 'Create, update, and delete users'),
(2, 'settings.manage', 'settings', 'Manage site settings and SMTP configuration'),
(3, 'projects.manage', 'projects', 'Manage projects and portfolio content'),
(4, 'blog.manage', 'blog', 'Manage blog posts and categories'),
(5, 'media.upload', 'media', 'Upload and delete media library assets'),
(6, 'forms.read', 'forms', 'View form submissions')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- Assign Permissions to Roles
INSERT IGNORE INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(2, 3), (2, 4), (2, 5), (2, 6),
(3, 4), (3, 5);

-- Default Super Admin User (Email: admin@kinetic.studio, Password: AdminPassword2026!)
-- Hashed password using bcrypt 10 rounds
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role_id`, `is_active`) VALUES
(1, 'admin@kinetic.studio', '$2a$10$wT8B14dYkM0Lg8P./f9r.OqR63R0iS98P.6L5sO2kU1.1e8x5a3yG', 'Super', 'Admin', 1, 1)
ON DUPLICATE KEY UPDATE `first_name` = VALUES(`first_name`);

-- Default Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `category`, `description`) VALUES
('site_title', 'KINETIC — Architectural Design Laboratory', 'general', 'Main website title'),
('site_tagline', 'Engineering digital monuments with architectural discipline', 'general', 'Website tagline'),
('contact_email', 'contact@kinetic-studio.com', 'general', 'Primary contact email address'),
('primary_accent_color', '#E6A800', 'theme', 'Yellow brand accent color')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- Default Studio Page Data
INSERT INTO `studio_page` (`id`, `hero_title`, `hero_subtitle`, `philosophy_content`) VALUES
(1, 'Engineering digital monuments with architectural discipline', 'KINETIC operates as an independent design laboratory bridging physical motion architecture, editorial visual identity, and high-performance digital systems.', 'We view digital spaces not as disposable interfaces, but as enduring architectural structures.')
ON DUPLICATE KEY UPDATE `hero_title` = VALUES(`hero_title`);
