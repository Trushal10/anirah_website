-- Add optional SEO metadata fields used by admin and public pages.
ALTER TABLE `ServiceSeries`
  ADD COLUMN `seoTitle` VARCHAR(255) NULL AFTER `description`,
  ADD COLUMN `seoDescription` TEXT NULL AFTER `seoTitle`,
  ADD COLUMN `seoKeywords` TEXT NULL AFTER `seoDescription`;

ALTER TABLE `SubService`
  ADD COLUMN `seoTitle` VARCHAR(255) NULL AFTER `description`,
  ADD COLUMN `seoDescription` TEXT NULL AFTER `seoTitle`,
  ADD COLUMN `seoKeywords` TEXT NULL AFTER `seoDescription`;

ALTER TABLE `BlogPost`
  ADD COLUMN `seoTitle` VARCHAR(255) NULL AFTER `content`,
  ADD COLUMN `seoDescription` TEXT NULL AFTER `seoTitle`,
  ADD COLUMN `seoKeywords` TEXT NULL AFTER `seoDescription`;

ALTER TABLE `ContentArticle`
  ADD COLUMN `seoTitle` VARCHAR(255) NULL AFTER `content`,
  ADD COLUMN `seoDescription` TEXT NULL AFTER `seoTitle`,
  ADD COLUMN `seoKeywords` TEXT NULL AFTER `seoDescription`;
