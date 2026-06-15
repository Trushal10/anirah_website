-- Add optional summary text for government scheme cards and detail page hero copy.
ALTER TABLE `Scheme` ADD COLUMN `summary` TEXT NULL AFTER `slug`;
