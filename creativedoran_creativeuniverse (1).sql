-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 20, 2026 at 08:30 AM
-- Server version: 10.5.29-MariaDB-log
-- PHP Version: 8.4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `creativedoran_creativeuniverse`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(1, 'web-artisan', 'Eksekusi remote command: migrate:fresh', NULL, NULL, NULL, NULL, NULL, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate:fresh\",\"output\":\"\\n  Dropping all tables .......................................... 528.25ms DONE\\n\\n   INFO  Preparing database.  \\n\\n  Creating migration table ...................................... 12.03ms DONE\\n\\n   INFO  Running migrations.  \\n\\n  0001_01_01_000000_create_users_table ......................... 165.33ms DONE\\n  0001_01_01_000001_create_cache_table .......................... 13.36ms DONE\\n  0001_01_01_000002_create_jobs_table ........................... 40.18ms DONE\\n  0001_01_01_000003_create_asset_links_table .................... 92.81ms DONE\\n  2026_06_15_061333_create_permission_tables ................... 142.35ms DONE\\n  2026_06_15_061343_create_activity_log_table ................... 28.12ms DONE\\n  2026_06_15_061344_add_event_column_to_activity_log_table ....... 4.58ms DONE\\n  2026_06_15_061345_add_batch_uuid_column_to_activity_log_table .. 8.22ms DONE\\n  2026_06_15_061350_create_notifications_table .................. 14.55ms DONE\\n  2026_06_17_000000_create_pricetag_tables ..................... 353.22ms DONE\\n  2026_06_17_222718_create_pricetag_batch_items_table ........... 58.61ms DONE\\n  2026_06_18_205500_add_settings_to_users_table .................. 6.58ms DONE\\n  2026_06_18_215000_rename_superadmin_to_root .................... 2.33ms DONE\\n  2026_06_19_113928_create_personal_access_tokens_table ......... 30.59ms DONE\\n  2026_06_22_094347_add_icon_svg_to_pricetag_categories_table .... 5.89ms DONE\\n  2026_06_22_103807_drop_pending_columns_from_users_table ....... 18.54ms DONE\\n  2026_06_23_160532_create_conversations_table ................... 7.06ms DONE\\n  2026_06_23_160532_create_messages_table ....................... 50.73ms DONE\\n  2026_06_23_160533_create_conversation_user_table .............. 56.73ms DONE\\n  2026_06_24_000000_update_variant_name_default_on_pricetag_products_table  3.09ms DONE\\n  2026_06_26_000000_create_odds_workflow_tables ...................... 1s DONE\\n  2026_06_26_120000_add_quality_issue_to_odds_workflow .......... 17.31ms DONE\\n  2026_06_27_130844_create_divisions_table ...................... 18.64ms DONE\\n  2026_06_27_130844_create_positions_table ...................... 33.65ms DONE\\n  2026_06_27_130845_add_onboarding_fields_to_users_table ....... 249.41ms DONE\\n  2026_07_01_000000_add_context_fields_to_conversations_table ... 59.37ms DONE\\n  2026_07_10_144915_create_homework_tasks_table .................. 8.38ms DONE\\n  2026_07_10_144924_create_homework_task_user_table ............. 67.52ms DONE\\n  2026_07_10_151226_add_file_link_to_homework_tasks_table ........ 5.30ms DONE\\n  2026_07_11_090836_change_file_paths_to_json_on_homework_tasks_table  15.53ms DONE\\n  2026_07_11_092214_create_app_settings_table ................... 21.50ms DONE\\n  2026_07_11_112058_add_created_by_to_homework_tasks_table ...... 28.77ms DONE\\n  2026_07_14_120000_add_delay_reasons_to_homework_tasks_table .... 5.90ms DONE\\n  2026_07_14_160000_create_creative_report_tables .............. 139.49ms DONE\\n  2026_07_14_170000_create_application_registry_tables ......... 159.94ms DONE\\n  2026_07_14_180000_rename_homework_tasks_to_kv_retail_tasks ..... 9.97ms DONE\\n  2026_07_14_190000_create_stored_files_table ................... 48.32ms DONE\\n  2026_07_14_200000_rename_pricetag_tables_to_generator_pricetag  15.78ms DONE\\n  2026_07_15_160000_add_legacy_reference_to_kv_retail_tasks_table  31.40ms DONE\\n\\n\"}', NULL, '2026-07-15 09:37:29', '2026-07-15 09:37:29'),
(2, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 1, NULL, NULL, '{\"attributes\":{\"name\":\"root\",\"username\":\"root\",\"email\":\"root@gmail.com\",\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, NULL, NULL, '{\"attributes\":[],\"old\":[]}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\Category', 'created', 1, NULL, NULL, '{\"attributes\":{\"name\":\"Marketplace Banner\",\"score_weight\":\"2.00\",\"normal_revision_limit\":2,\"workload_point\":2,\"sla_days\":3,\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\Category', 'created', 2, NULL, NULL, '{\"attributes\":{\"name\":\"Social Media Feed\",\"score_weight\":\"1.50\",\"normal_revision_limit\":2,\"workload_point\":1,\"sla_days\":2,\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(6, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\SystemRule', 'created', 1, NULL, NULL, '{\"attributes\":{\"key\":\"brief_return_limit\",\"value\":{\"count\":2},\"description\":\"Jumlah maksimal brief boleh dikembalikan sebelum eskalasi SPV.\",\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\SystemRule', 'created', 2, NULL, NULL, '{\"attributes\":{\"key\":\"client_review_timeout_days\",\"value\":{\"days\":3},\"description\":\"Batas client tidak merespons review sebelum auto done.\",\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(8, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\SystemRule', 'created', 3, NULL, NULL, '{\"attributes\":{\"key\":\"no_response_hours\",\"value\":{\"hours\":24},\"description\":\"Batas tidak ada respons sebelum sistem mengirim reminder ODDS.\",\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(9, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\SystemRule', 'created', 4, NULL, NULL, '{\"attributes\":{\"key\":\"leader_revision_quality_issue_limit\",\"value\":{\"count\":2},\"description\":\"Batas wajar revisi SPV sebelum task ditandai sebagai quality issue.\",\"is_active\":true,\"created_by\":null,\"updated_by\":null}}', NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(10, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 1, NULL, NULL, '{\"attributes\":{\"name\":\"Smarthome Devices\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(11, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 2, NULL, NULL, '{\"attributes\":{\"name\":\"Smart Wearables\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(12, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 3, NULL, NULL, '{\"attributes\":{\"name\":\"Headphone\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(13, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 4, NULL, NULL, '{\"attributes\":{\"name\":\"Speaker\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(14, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 5, NULL, NULL, '{\"attributes\":{\"name\":\"Mobile Power & Connectivity\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(15, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 6, NULL, NULL, '{\"attributes\":{\"name\":\"Device Tracking\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(16, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 7, NULL, NULL, '{\"attributes\":{\"name\":\"Bag\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(17, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 8, NULL, NULL, '{\"attributes\":{\"name\":\"Computer Peripherals\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(18, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 9, NULL, NULL, '{\"attributes\":{\"name\":\"Storage\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(19, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 10, NULL, NULL, '{\"attributes\":{\"name\":\"Remote Collaboration\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(20, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 11, NULL, NULL, '{\"attributes\":{\"name\":\"Content Creation Essentials\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(21, 'pricetag', '[PRICETAG] Category created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagCategory', 'created', 12, NULL, NULL, '{\"attributes\":{\"name\":\"Phone Accessories\",\"icon_svg\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(22, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 1, NULL, NULL, '{\"attributes\":{\"category_id\":1,\"name\":\"Smart Bulb RGB\",\"variant_name\":\"White\",\"normal_price\":150000,\"discount_price\":120000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(23, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 2, NULL, NULL, '{\"attributes\":{\"category_id\":2,\"name\":\"FitBand Pro Max\",\"variant_name\":\"Black\",\"normal_price\":500000,\"discount_price\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(24, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 3, NULL, NULL, '{\"attributes\":{\"category_id\":3,\"name\":\"SoundMax Noise Cancelling\",\"variant_name\":\" \",\"normal_price\":1200000,\"discount_price\":999000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(25, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 4, NULL, NULL, '{\"attributes\":{\"category_id\":4,\"name\":\"BoomBox Mini 360\",\"variant_name\":\"Red\",\"normal_price\":350000,\"discount_price\":300000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(26, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 5, NULL, NULL, '{\"attributes\":{\"category_id\":5,\"name\":\"PowerBank 10000mAh\",\"variant_name\":\"Silver\",\"normal_price\":250000,\"discount_price\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(27, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 6, NULL, NULL, '{\"attributes\":{\"category_id\":6,\"name\":\"Smart Tag Finder\",\"variant_name\":\"White\",\"normal_price\":150000,\"discount_price\":99000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(28, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 7, NULL, NULL, '{\"attributes\":{\"category_id\":7,\"name\":\"Tech Backpack 15 inch\",\"variant_name\":\"Grey\",\"normal_price\":450000,\"discount_price\":400000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(29, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 8, NULL, NULL, '{\"attributes\":{\"category_id\":8,\"name\":\"Wireless Mouse Silent\",\"variant_name\":\"Black\",\"normal_price\":120000,\"discount_price\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(30, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 9, NULL, NULL, '{\"attributes\":{\"category_id\":9,\"name\":\"SSD Portable 1TB\",\"variant_name\":\"Black\",\"normal_price\":1500000,\"discount_price\":1350000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(31, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 10, NULL, NULL, '{\"attributes\":{\"category_id\":10,\"name\":\"Webcam 1080p\",\"variant_name\":\" \",\"normal_price\":600000,\"discount_price\":550000,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(32, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 11, NULL, NULL, '{\"attributes\":{\"category_id\":11,\"name\":\"Ring Light 10 inch\",\"variant_name\":\" \",\"normal_price\":100000,\"discount_price\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(33, 'pricetag', '[PRICETAG] Product created', 'App\\SubApps\\Generator\\Pricetag\\Models\\PricetagProduct', 'created', 12, NULL, NULL, '{\"attributes\":{\"category_id\":12,\"name\":\"Tempered Glass Premium\",\"variant_name\":\"Clear\",\"normal_price\":50000,\"discount_price\":null,\"created_by\":1,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(34, 'web-artisan', 'Eksekusi remote command: db:seed (full seeder)', NULL, NULL, NULL, NULL, NULL, '{\"ip\":\"103.109.160.134\",\"command\":\"db:seed\",\"output\":\"\\n   INFO  Seeding database.  \\n\\n  Database\\\\Seeders\\\\ProductionDatabaseSeeder .......................... RUNNING  \\n  Database\\\\Seeders\\\\RolePermissionSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\RolePermissionSeeder .......................... 190 ms DONE  \\n\\n  Database\\\\Seeders\\\\OnboardingDataSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\OnboardingDataSeeder ........................... 83 ms DONE  \\n\\n  Database\\\\Seeders\\\\OddsPermissionSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\OddsPermissionSeeder .......................... 225 ms DONE  \\n\\n  Database\\\\Seeders\\\\OddsDefaultSeeder ................................. RUNNING  \\n  Database\\\\Seeders\\\\OddsDefaultSeeder .............................. 40 ms DONE  \\n\\n  Database\\\\Seeders\\\\ApplicationRegistrySeeder ......................... RUNNING  \\n  Database\\\\Seeders\\\\ApplicationRegistrySeeder ..................... 136 ms DONE  \\n\\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................... RUNNING  \\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................ 14 ms DONE  \\n\\n  Database\\\\Seeders\\\\ProductionDatabaseSeeder ...................... 963 ms DONE  \\n\\n  Database\\\\Seeders\\\\PricetagTestDataSeeder ............................ RUNNING  \\nSeeded products and categories from DB Produk Sementara.csv\\n  Database\\\\Seeders\\\\PricetagTestDataSeeder ........................ 189 ms DONE  \\n\\n\"}', NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(35, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell\\/5.1.26100.8655\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:39:42', '2026-07-15 09:39:42'),
(36, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell\\/5.1.26100.8655\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:39:42', '2026-07-15 09:39:42'),
(37, 'maintenance-ui', 'Gagal menjalankan maintenance command: restore-hosting-data', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"restore-hosting-data\",\"error\":\"File restore hosting tidak ditemukan: \\/home\\/creativedoran\\/creative.doran.id\\/storage\\/app\\/private\\/hosting-restore.json\"}', NULL, '2026-07-15 09:39:42', '2026-07-15 09:39:42'),
(38, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell\\/5.1.26100.8655\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:47:54', '2026-07-15 09:47:54'),
(39, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell\\/5.1.26100.8655\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:47:54', '2026-07-15 09:47:54'),
(40, 'maintenance-ui', 'Menjalankan maintenance command: restore-hosting-data', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"restore-hosting-data\",\"artisan_command\":\"db:seed --class=HostingRealDataSeeder --force\",\"output\":\"\\n   INFO  Seeding database.  \\n\\n  Database\\\\Seeders\\\\ProductionDatabaseSeeder .......................... RUNNING  \\n  Database\\\\Seeders\\\\RolePermissionSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\RolePermissionSeeder .......................... 187 ms DONE  \\n\\n  Database\\\\Seeders\\\\OnboardingDataSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\OnboardingDataSeeder ........................... 15 ms DONE  \\n\\n  Database\\\\Seeders\\\\OddsPermissionSeeder .............................. RUNNING  \\n  Database\\\\Seeders\\\\OddsPermissionSeeder .......................... 185 ms DONE  \\n\\n  Database\\\\Seeders\\\\OddsDefaultSeeder ................................. RUNNING  \\n  Database\\\\Seeders\\\\OddsDefaultSeeder ............................... 6 ms DONE  \\n\\n  Database\\\\Seeders\\\\ApplicationRegistrySeeder ......................... RUNNING  \\n  Database\\\\Seeders\\\\ApplicationRegistrySeeder ...................... 64 ms DONE  \\n\\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................... RUNNING  \\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................ 14 ms DONE  \\n\\n  Database\\\\Seeders\\\\ProductionDatabaseSeeder ...................... 487 ms DONE  \\n\\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................... RUNNING  \\n  Database\\\\Seeders\\\\ApplicationAccessSeeder ........................ 42 ms DONE  \\n\\nRestored 4 real users, 7 KV Retail tasks, and 12 real-user assignments. Skipped 11 legacy default-account assignments.\\n\"}', NULL, '2026-07-15 09:47:54', '2026-07-15 09:47:54'),
(41, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:48:10', '2026-07-15 09:48:10'),
(42, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:48:10', '2026-07-15 09:48:10'),
(43, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:50:06', '2026-07-15 09:50:06'),
(44, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 09:50:06', '2026-07-15 09:50:06'),
(45, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"114.5.104.81\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:18:12', '2026-07-15 10:18:12'),
(46, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"114.5.104.81\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:18:12', '2026-07-15 10:18:12'),
(47, 'maintenance-ui', 'Mengaktifkan maintenance darurat', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"114.5.104.81\",\"active\":true}', NULL, '2026-07-15 10:18:35', '2026-07-15 10:18:35'),
(48, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"114.5.104.81\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:18:41', '2026-07-15 10:18:41'),
(49, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"114.5.104.81\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:18:41', '2026-07-15 10:18:41'),
(50, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"114.5.104.81\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:19:12', '2026-07-15 10:19:12'),
(51, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"114.5.104.81\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-15 10:19:12', '2026-07-15 10:19:12'),
(52, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 02:03:25', '2026-07-16 02:03:25'),
(53, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 02:03:25', '2026-07-16 02:03:25'),
(54, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 02:03:45', '2026-07-16 02:03:45'),
(55, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 02:03:45', '2026-07-16 02:03:45'),
(56, 'maintenance-ui', 'Menonaktifkan maintenance darurat', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"active\":false}', NULL, '2026-07-16 02:03:52', '2026-07-16 02:03:52'),
(57, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 05:27:10', '2026-07-16 05:27:10'),
(58, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 05:27:10', '2026-07-16 05:27:10'),
(59, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 3, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"whatsapp_number\":\"62895392710209\",\"updated_by\":1},\"old\":{\"whatsapp_number\":\"895392710209\",\"updated_by\":null}}', NULL, '2026-07-16 05:31:43', '2026-07-16 05:31:43'),
(60, 'user-management', '[CORE] User account settings managed: bobby-designer@creative.doran.id', 'App\\Models\\Core\\User', NULL, 3, 'App\\Models\\Core\\User', 1, '{\"password_reset\":false,\"roles\":[\"SPV\"],\"permissions\":[\"kv-retail.tasks.create\",\"kv-retail.tasks.delete\",\"kv-retail.tasks.update-status\",\"kv-retail.tasks.view\"],\"applications\":[\"kv-retail\",\"creative-report\",\"odds\",\"generator\"],\"ip\":\"103.109.160.134\"}', NULL, '2026-07-16 05:31:43', '2026-07-16 05:31:43'),
(61, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"name\":\"System Admin\",\"updated_by\":1},\"old\":{\"name\":\"root\",\"updated_by\":null}}', NULL, '2026-07-16 05:36:07', '2026-07-16 05:36:07'),
(62, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 09:03:26', '2026-07-16 09:03:26'),
(63, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-16 09:03:26', '2026-07-16 09:03:26'),
(64, 'maintenance-ui', 'Mengaktifkan maintenance darurat', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"active\":true}', NULL, '2026-07-16 09:03:49', '2026-07-16 09:03:49'),
(65, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-16 09:04:33', '2026-07-16 09:04:33'),
(66, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-16 09:04:33', '2026-07-16 09:04:33'),
(67, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-17 01:21:33', '2026-07-17 01:21:33'),
(68, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-17 01:21:33', '2026-07-17 01:21:33'),
(69, 'maintenance-ui', 'Menonaktifkan maintenance darurat', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"active\":false}', NULL, '2026-07-17 01:21:41', '2026-07-17 01:21:41'),
(70, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 01:46:27', '2026-07-17 01:46:27'),
(71, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 01:46:27', '2026-07-17 01:46:27'),
(72, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\DesignerProfile', 'created', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"user_id\":4,\"status\":\"available\",\"specializations\":[],\"daily_capacity_points\":8,\"max_active_tasks\":3,\"assignment_priority\":100,\"is_active\":true,\"created_by\":1,\"updated_by\":1}}', NULL, '2026-07-17 01:49:44', '2026-07-17 01:49:44'),
(73, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 02:17:09', '2026-07-17 02:17:09'),
(74, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 02:17:09', '2026-07-17 02:17:09'),
(75, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 06:19:59', '2026-07-17 06:19:59'),
(76, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-17 06:19:59', '2026-07-17 06:19:59'),
(77, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 2, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"whatsapp_number\":\"6285640442186\",\"updated_by\":1},\"old\":{\"whatsapp_number\":\"85640442186\",\"updated_by\":null}}', NULL, '2026-07-17 06:21:55', '2026-07-17 06:21:55'),
(78, 'user-management', '[CORE] User account settings managed: rohmat@creative.doran.id', 'App\\Models\\Core\\User', NULL, 2, 'App\\Models\\Core\\User', 1, '{\"password_reset\":false,\"roles\":[\"Manajer\"],\"permissions\":[\"access-odds\",\"create-odds-tasks\",\"cancel-odds-tasks\",\"approve-odds-extra-revisions\",\"approve-odds-urgent-revisions\"],\"applications\":[\"kv-retail\",\"creative-report\",\"odds\",\"generator\"],\"ip\":\"103.109.160.134\"}', NULL, '2026-07-17 06:21:55', '2026-07-17 06:21:55'),
(79, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\Task', 'created', 1, 'App\\Models\\Core\\User', 2, '{\"attributes\":{\"task_number\":\"ODDS-260717-0001\",\"request_type\":\"design\",\"category_id\":2,\"category_snapshot\":{\"id\":2,\"name\":\"Social Media Feed\",\"score_weight\":1.5,\"normal_revision_limit\":2,\"workload_point\":1,\"sla_days\":2},\"requester_id\":2,\"preferred_designer_id\":4,\"assigned_designer_id\":4,\"design_purpose\":\"Desain Feed Agustusan\",\"brief_text\":\"fgnm,nhfgnhhrtghddhsfghdfghdgfhdfhgdg\",\"reference_visual\":null,\"deadline\":\"2026-07-17T17:00:00.000000Z\",\"important_matrix\":\"normal\",\"attachment_notes\":null,\"status\":\"submitted\",\"task_type\":\"new_task\",\"workload_point\":1,\"priority_score\":\"0.00\",\"brief_return_count\":0,\"leader_revision_count\":0,\"quality_issue_flag\":false,\"quality_issue_note\":null,\"normal_revision_count\":0,\"extra_revision_used_at\":null,\"extra_revision_approved_by\":null,\"urgent_revision_used_at\":null,\"urgent_revision_approved_by\":null,\"started_at\":null,\"finished_at\":null,\"approved_at\":null,\"done_at\":null,\"cancelled_at\":null,\"cancel_reason\":null,\"current_queue_id\":null,\"created_by\":2,\"updated_by\":2}}', NULL, '2026-07-17 06:30:44', '2026-07-17 06:30:44'),
(80, 'odds', 'created', 'App\\SubApps\\Odds\\Models\\TaskBrief', 'created', 1, 'App\\Models\\Core\\User', 2, '{\"attributes\":{\"task_id\":1,\"content\":\"fgnm,nhfgnhhrtghddhsfghdfghdgfhdfhgdg\",\"reference_visual\":null,\"attachments\":null,\"last_return_note\":null,\"ai_summary\":null,\"updated_by\":2}}', NULL, '2026-07-17 06:30:44', '2026-07-17 06:30:44'),
(81, 'odds', 'Task created', 'App\\SubApps\\Odds\\Models\\Task', 'task_created', 1, 'App\\Models\\Core\\User', 2, '[]', NULL, '2026-07-17 06:30:44', '2026-07-17 06:30:44'),
(82, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-17 07:25:17', '2026-07-17 07:25:17'),
(83, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-17 07:25:17', '2026-07-17 07:25:17'),
(84, 'maintenance-ui', 'Gagal menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"error\":\"SQLSTATE[HY000]: General error: 1553 Cannot drop index \'creative_report_assessments_user_id_period_unique\': needed in a foreign key constraint (Connection: mysql, SQL: alter table `creative_report_assessments` drop index `creative_report_assessments_user_id_period_unique`)\"}', NULL, '2026-07-17 08:45:03', '2026-07-17 08:45:03'),
(85, 'maintenance-ui', 'Gagal menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"error\":\"SQLSTATE[42S01]: Base table or view already exists: 1050 Table \'creative_report_members\' already exists (Connection: mysql, SQL: create table `creative_report_members` (`id` bigint unsigned not null auto_increment primary key, `user_id` bigint unsigned null, `name` varchar(255) not null, `position_id` bigint unsigned null, `position_name` varchar(255) not null, `status` varchar(255) not null default \'pending\', `joined_at` timestamp null, `resigned_at` timestamp null, `reviewed_by` bigint unsigned null, `reviewed_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate \'utf8mb4_unicode_ci\')\"}', NULL, '2026-07-17 08:45:22', '2026-07-17 08:45:22'),
(86, 'maintenance-ui', 'Gagal menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"error\":\"SQLSTATE[42S01]: Base table or view already exists: 1050 Table \'creative_report_members\' already exists (Connection: mysql, SQL: create table `creative_report_members` (`id` bigint unsigned not null auto_increment primary key, `user_id` bigint unsigned null, `name` varchar(255) not null, `position_id` bigint unsigned null, `position_name` varchar(255) not null, `status` varchar(255) not null default \'pending\', `joined_at` timestamp null, `resigned_at` timestamp null, `reviewed_by` bigint unsigned null, `reviewed_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate \'utf8mb4_unicode_ci\')\"}', NULL, '2026-07-17 08:50:25', '2026-07-17 08:50:25'),
(87, 'maintenance-ui', 'Gagal menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"error\":\"SQLSTATE[HY000]: General error: 1553 Cannot drop index \'creative_report_assessments_user_id_period_unique\': needed in a foreign key constraint (Connection: mysql, SQL: alter table `creative_report_assessments` drop index `creative_report_assessments_user_id_period_unique`)\"}', NULL, '2026-07-17 08:53:54', '2026-07-17 08:53:54'),
(88, 'maintenance-ui', 'Menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"artisan_command\":\"migrate\",\"output\":\"\\n   INFO  Running migrations.  \\n\\n  2026_07_17_090000_create_creative_report_members_table ....... 198.16ms DONE\\n\\n\"}', NULL, '2026-07-17 08:56:59', '2026-07-17 08:56:59'),
(89, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 17:00:03', '2026-07-17 17:00:03'),
(90, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 18:00:02', '2026-07-17 18:00:02'),
(91, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 19:00:02', '2026-07-17 19:00:02'),
(92, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 20:00:06', '2026-07-17 20:00:06'),
(93, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 21:00:14', '2026-07-17 21:00:14'),
(94, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 22:00:13', '2026-07-17 22:00:13'),
(95, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-17 23:00:02', '2026-07-17 23:00:02'),
(96, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 00:00:02', '2026-07-18 00:00:02'),
(97, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 01:00:02', '2026-07-18 01:00:02'),
(98, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-18 01:01:52', '2026-07-18 01:01:52'),
(99, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-18 01:01:52', '2026-07-18 01:01:52'),
(100, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 02:00:02', '2026-07-18 02:00:02'),
(101, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 03:00:02', '2026-07-18 03:00:02'),
(102, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 04:00:02', '2026-07-18 04:00:02'),
(103, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-18 04:06:19', '2026-07-18 04:06:19'),
(104, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-18 04:06:19', '2026-07-18 04:06:19'),
(105, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 05:00:02', '2026-07-18 05:00:02'),
(106, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 06:00:02', '2026-07-18 06:00:02'),
(107, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 07:00:04', '2026-07-18 07:00:04'),
(108, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 07:00:04', '2026-07-18 07:00:04'),
(109, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 08:00:04', '2026-07-18 08:00:04'),
(110, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 08:00:04', '2026-07-18 08:00:04'),
(111, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 09:00:02', '2026-07-18 09:00:02'),
(112, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 09:00:02', '2026-07-18 09:00:02'),
(113, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 10:00:03', '2026-07-18 10:00:03'),
(114, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 10:00:04', '2026-07-18 10:00:04'),
(115, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 11:00:02', '2026-07-18 11:00:02'),
(116, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 11:00:02', '2026-07-18 11:00:02'),
(117, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 12:00:04', '2026-07-18 12:00:04'),
(118, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 12:00:04', '2026-07-18 12:00:04'),
(119, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 13:00:03', '2026-07-18 13:00:03'),
(120, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 13:00:03', '2026-07-18 13:00:03'),
(121, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 14:00:03', '2026-07-18 14:00:03'),
(122, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 14:00:03', '2026-07-18 14:00:03'),
(123, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 15:00:08', '2026-07-18 15:00:08'),
(124, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 15:00:08', '2026-07-18 15:00:08'),
(125, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 16:00:02', '2026-07-18 16:00:02'),
(126, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 16:00:02', '2026-07-18 16:00:02'),
(127, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 17:00:02', '2026-07-18 17:00:02'),
(128, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 17:00:03', '2026-07-18 17:00:03'),
(129, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 18:00:02', '2026-07-18 18:00:02'),
(130, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 18:00:02', '2026-07-18 18:00:02'),
(131, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 19:00:02', '2026-07-18 19:00:02'),
(132, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 19:00:02', '2026-07-18 19:00:02'),
(133, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 20:00:04', '2026-07-18 20:00:04'),
(134, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 20:00:04', '2026-07-18 20:00:04'),
(135, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 21:00:04', '2026-07-18 21:00:04'),
(136, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 21:00:04', '2026-07-18 21:00:04'),
(137, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 22:00:11', '2026-07-18 22:00:11'),
(138, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 22:00:15', '2026-07-18 22:00:15'),
(139, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-18 23:00:07', '2026-07-18 23:00:07'),
(140, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-18 23:00:07', '2026-07-18 23:00:07'),
(141, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 00:00:04', '2026-07-19 00:00:04'),
(142, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 00:00:04', '2026-07-19 00:00:04'),
(143, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 01:00:02', '2026-07-19 01:00:02'),
(144, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 01:00:02', '2026-07-19 01:00:02'),
(145, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 02:00:04', '2026-07-19 02:00:04'),
(146, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 02:00:04', '2026-07-19 02:00:04'),
(147, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:49:42', '2026-07-19 02:49:42'),
(148, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:49:42', '2026-07-19 02:49:42'),
(149, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":[],\"old\":[]}', NULL, '2026-07-19 02:53:48', '2026-07-19 02:53:48'),
(150, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/1\\/avatars\\/01KXW4PKSGZJWCXXSVSBJNX2WV.jpg\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-19 02:53:49', '2026-07-19 02:53:49'),
(151, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/1\\/avatars\\/01KXW4QK3A97KR8V4YWD2F6YR1.jpg\"},\"old\":{\"avatar_path\":\"core\\/users\\/1\\/avatars\\/01KXW4PKSGZJWCXXSVSBJNX2WV.jpg\"}}', NULL, '2026-07-19 02:54:21', '2026-07-19 02:54:21'),
(152, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 1, 'App\\Models\\Core\\User', 1, '{\"attributes\":[],\"old\":[]}', NULL, '2026-07-19 02:54:27', '2026-07-19 02:54:27'),
(153, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:55:28', '2026-07-19 02:55:28'),
(154, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:55:28', '2026-07-19 02:55:28');
INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(155, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:55:42', '2026-07-19 02:55:42'),
(156, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:55:42', '2026-07-19 02:55:42'),
(157, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 4, 'App\\Models\\Core\\User', 4, '{\"attributes\":{\"email\":\"anjaskurniawan737@gmail.com\",\"whatsapp_number\":\"62895809462040\",\"updated_by\":4},\"old\":{\"email\":null,\"whatsapp_number\":\"895809462040\",\"updated_by\":null}}', NULL, '2026-07-19 02:57:38', '2026-07-19 02:57:38'),
(158, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 4, 'App\\Models\\Core\\User', 4, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/4\\/avatars\\/01KXW4XMGR0PBX16WXGPS68RSK.jpg\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-19 02:57:39', '2026-07-19 02:57:39'),
(159, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:57:47', '2026-07-19 02:57:47'),
(160, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:57:47', '2026-07-19 02:57:47'),
(161, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:58:00', '2026-07-19 02:58:00'),
(162, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\",\"user_agent\":\"Mozilla\\/5.0 (Linux; Android 10; K) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Mobile Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-19 02:58:00', '2026-07-19 02:58:00'),
(163, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 4, 'App\\Models\\Core\\User', 1, '{\"attributes\":{\"updated_by\":1},\"old\":{\"updated_by\":4}}', NULL, '2026-07-19 02:59:27', '2026-07-19 02:59:27'),
(164, 'user-management', '[CORE] User account settings managed: anjaskurniawan737@gmail.com', 'App\\Models\\Core\\User', NULL, 4, 'App\\Models\\Core\\User', 1, '{\"password_reset\":false,\"roles\":[\"Designer\"],\"permissions\":[],\"applications\":[\"odds\",\"generator\",\"kv-retail\"],\"ip\":\"2001:448a:c0f0:750d:491d:acf9:1724:aa34\"}', NULL, '2026-07-19 02:59:27', '2026-07-19 02:59:27'),
(165, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 03:00:04', '2026-07-19 03:00:04'),
(166, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 03:00:04', '2026-07-19 03:00:04'),
(167, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 04:00:03', '2026-07-19 04:00:03'),
(168, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 04:00:03', '2026-07-19 04:00:03'),
(169, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 05:00:03', '2026-07-19 05:00:03'),
(170, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 05:00:03', '2026-07-19 05:00:03'),
(171, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 06:00:04', '2026-07-19 06:00:04'),
(172, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 06:00:04', '2026-07-19 06:00:04'),
(173, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 07:00:03', '2026-07-19 07:00:03'),
(174, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 07:00:04', '2026-07-19 07:00:04'),
(175, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 08:00:04', '2026-07-19 08:00:04'),
(176, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 08:00:04', '2026-07-19 08:00:04'),
(177, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 09:00:07', '2026-07-19 09:00:07'),
(178, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 09:00:08', '2026-07-19 09:00:08'),
(179, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 10:00:04', '2026-07-19 10:00:04'),
(180, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 10:00:04', '2026-07-19 10:00:04'),
(181, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 11:00:05', '2026-07-19 11:00:05'),
(182, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 11:00:05', '2026-07-19 11:00:05'),
(183, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 12:00:05', '2026-07-19 12:00:05'),
(184, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 12:00:05', '2026-07-19 12:00:05'),
(185, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 13:00:05', '2026-07-19 13:00:05'),
(186, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 13:00:05', '2026-07-19 13:00:05'),
(187, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 14:00:04', '2026-07-19 14:00:04'),
(188, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 14:00:04', '2026-07-19 14:00:04'),
(189, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 15:00:04', '2026-07-19 15:00:04'),
(190, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 15:00:04', '2026-07-19 15:00:04'),
(191, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 16:00:04', '2026-07-19 16:00:04'),
(192, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 16:00:04', '2026-07-19 16:00:04'),
(193, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 17:00:03', '2026-07-19 17:00:03'),
(194, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 17:00:03', '2026-07-19 17:00:03'),
(195, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 18:00:01', '2026-07-19 18:00:01'),
(196, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 18:00:01', '2026-07-19 18:00:01'),
(197, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 19:00:02', '2026-07-19 19:00:02'),
(198, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 19:00:02', '2026-07-19 19:00:02'),
(199, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 20:00:04', '2026-07-19 20:00:04'),
(200, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 20:00:04', '2026-07-19 20:00:04'),
(201, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 21:00:05', '2026-07-19 21:00:05'),
(202, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 21:00:06', '2026-07-19 21:00:06'),
(203, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 22:00:14', '2026-07-19 22:00:14'),
(204, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 22:00:15', '2026-07-19 22:00:15'),
(205, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-19 23:00:07', '2026-07-19 23:00:07'),
(206, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-19 23:00:07', '2026-07-19 23:00:07'),
(207, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-20 00:00:04', '2026-07-20 00:00:04'),
(208, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-20 00:00:04', '2026-07-20 00:00:04'),
(209, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 00:46:53', '2026-07-20 00:46:53'),
(210, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 2, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 00:46:53', '2026-07-20 00:46:53'),
(211, 'odds', 'Task overdue', 'App\\SubApps\\Odds\\Models\\Task', 'task_overdue', 1, NULL, NULL, '[]', NULL, '2026-07-20 01:00:04', '2026-07-20 01:00:04'),
(212, 'odds', 'No response reminder', 'App\\SubApps\\Odds\\Models\\Task', 'no_response_reminder', 1, NULL, NULL, '[]', NULL, '2026-07-20 01:00:04', '2026-07-20 01:00:04'),
(213, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:00:35', '2026-07-20 01:00:35'),
(214, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:00:35', '2026-07-20 01:00:35'),
(215, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 2, 'App\\Models\\Core\\User', 2, '{\"attributes\":{\"email\":\"torot62@gmail.com\",\"updated_by\":2},\"old\":{\"email\":null,\"updated_by\":1}}', NULL, '2026-07-20 01:04:51', '2026-07-20 01:04:51'),
(216, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 2, 'App\\Models\\Core\\User', 2, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/2\\/avatars\\/01KXYGVTTZKRGFT8C1Y5S1WBQ5.png\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-20 01:04:52', '2026-07-20 01:04:52'),
(217, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 6, NULL, NULL, '{\"attributes\":{\"name\":\"Richard-Designer\",\"username\":\"Richard-Designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:10:53', '2026-07-20 01:10:53'),
(218, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 6, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:10:53', '2026-07-20 01:10:53'),
(219, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 6, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:10:53', '2026-07-20 01:10:53'),
(220, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 7, NULL, NULL, '{\"attributes\":{\"name\":\"Fadhil-Designer\",\"username\":\"Fadhil-Designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:11:14', '2026-07-20 01:11:14'),
(221, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 7, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:11:14', '2026-07-20 01:11:14'),
(222, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 7, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:11:14', '2026-07-20 01:11:14'),
(223, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 6, 'App\\Models\\Core\\User', 6, '{\"attributes\":{\"name\":\"Richard King Wijaya\",\"whatsapp_number\":\"89520220605\"},\"old\":{\"name\":\"Richard-Designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:11:27', '2026-07-20 01:11:27'),
(224, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 7, 'App\\Models\\Core\\User', 7, '{\"attributes\":{\"name\":\"Muhammad Fadhil Putra Alamsyah\",\"whatsapp_number\":\"82131512151\"},\"old\":{\"name\":\"Fadhil-Designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:11:55', '2026-07-20 01:11:55'),
(225, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 6, 'App\\Models\\Core\\User', 6, '{\"attributes\":{\"email\":\"richardkingwijaya@gmail.com\",\"whatsapp_number\":\"6289520220605\",\"updated_by\":6},\"old\":{\"email\":null,\"whatsapp_number\":\"89520220605\",\"updated_by\":null}}', NULL, '2026-07-20 01:13:37', '2026-07-20 01:13:37'),
(226, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 6, 'App\\Models\\Core\\User', 6, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/6\\/avatars\\/01KXYHBXF6KW9KWQT1ZAV23HA9.png\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-20 01:13:39', '2026-07-20 01:13:39'),
(227, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 7, 'App\\Models\\Core\\User', 7, '{\"attributes\":{\"email\":\"fadhilputra244@gmail.com\",\"whatsapp_number\":\"6282131512151\",\"updated_by\":7},\"old\":{\"email\":null,\"whatsapp_number\":\"82131512151\",\"updated_by\":null}}', NULL, '2026-07-20 01:13:44', '2026-07-20 01:13:44'),
(228, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 7, 'App\\Models\\Core\\User', 7, '{\"attributes\":[],\"old\":[]}', NULL, '2026-07-20 01:15:01', '2026-07-20 01:15:01'),
(229, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 8, NULL, NULL, '{\"attributes\":{\"name\":\"shaloom-designer\",\"username\":\"shaloom-designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:16:27', '2026-07-20 01:16:27'),
(230, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 8, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:16:27', '2026-07-20 01:16:27'),
(231, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 8, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:16:27', '2026-07-20 01:16:27'),
(232, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 9, NULL, NULL, '{\"attributes\":{\"name\":\"Muhammad-Designer\",\"username\":\"Muhammad-Designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:16:56', '2026-07-20 01:16:56'),
(233, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 9, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:16:56', '2026-07-20 01:16:56'),
(234, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 9, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:16:56', '2026-07-20 01:16:56'),
(235, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 8, 'App\\Models\\Core\\User', 8, '{\"attributes\":{\"name\":\"Shaloom Justin Fernando\",\"whatsapp_number\":\"89685627727\"},\"old\":{\"name\":\"shaloom-designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:17:11', '2026-07-20 01:17:11'),
(236, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 9, 'App\\Models\\Core\\User', 9, '{\"attributes\":{\"name\":\"Muhammad Ilham Fatoni\",\"whatsapp_number\":\"881-3276-752\"},\"old\":{\"name\":\"Muhammad-Designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:18:00', '2026-07-20 01:18:00'),
(237, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 10, NULL, NULL, '{\"attributes\":{\"name\":\"Salma-Designer\",\"username\":\"Salma-Designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:18:18', '2026-07-20 01:18:18'),
(238, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 10, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit\\/605.1.15 (KHTML, like Gecko) Version\\/26.5 Mobile\\/15E148 Safari\\/604.1\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:18:18', '2026-07-20 01:18:18'),
(239, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 10, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit\\/605.1.15 (KHTML, like Gecko) Version\\/26.5 Mobile\\/15E148 Safari\\/604.1\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:18:18', '2026-07-20 01:18:18'),
(240, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 11, NULL, NULL, '{\"attributes\":{\"name\":\"rizkyjulian-jete\",\"username\":\"rizkyjulian-jete\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:18:21', '2026-07-20 01:18:21'),
(241, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 11, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:18:21', '2026-07-20 01:18:21'),
(242, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 11, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:18:21', '2026-07-20 01:18:21'),
(243, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 8, 'App\\Models\\Core\\User', 8, '{\"attributes\":{\"email\":\"shalomfernando22@gmail.com\",\"whatsapp_number\":\"6289685627727\",\"updated_by\":8},\"old\":{\"email\":null,\"whatsapp_number\":\"89685627727\",\"updated_by\":null}}', NULL, '2026-07-20 01:18:29', '2026-07-20 01:18:29'),
(244, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 8, 'App\\Models\\Core\\User', 8, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/8\\/avatars\\/01KXYHMRZV6MAV2B9DS4NKEPQJ.jpg\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-20 01:18:29', '2026-07-20 01:18:29'),
(245, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 10, 'App\\Models\\Core\\User', 10, '{\"attributes\":{\"name\":\"Salma Maghfira\",\"whatsapp_number\":\"81231637272\"},\"old\":{\"name\":\"Salma-Designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:18:49', '2026-07-20 01:18:49'),
(246, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 11, 'App\\Models\\Core\\User', 11, '{\"attributes\":{\"name\":\"RIZKY JULIAN PRATAMA\",\"whatsapp_number\":\"81515495565\"},\"old\":{\"name\":\"rizkyjulian-jete\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:19:09', '2026-07-20 01:19:09'),
(247, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:11', '2026-07-20 01:19:11'),
(248, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 4, '{\"ip\":\"103.109.160.134\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:11', '2026-07-20 01:19:11'),
(249, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:17', '2026-07-20 01:19:17'),
(250, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36 Edg\\/150.0.0.0\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:17', '2026-07-20 01:19:17'),
(251, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 10, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:24', '2026-07-20 01:19:24'),
(252, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 10, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:19:24', '2026-07-20 01:19:24'),
(253, 'maintenance-ui', 'Menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"artisan_command\":\"migrate\",\"output\":\"\\n   INFO  Running migrations.  \\n\\n  2026_07_19_212003_rename_sla_days_to_sla_minutes_on_odds_categories  33.06ms DONE\\n  2026_07_19_214233_modify_odds_schema_for_sla_capacity ......... 49.53ms DONE\\n  2026_07_19_220236_drop_daily_capacity_minutes_from_odds_designer_profiles  6.86ms DONE\\n  2026_07_19_221933_drop_max_active_tasks_from_odds_designer_profiles  4.31ms DONE\\n  2026_07_19_225353_add_leave_dates_to_odds_designer_profiles .... 5.88ms DONE\\n\\n\"}', NULL, '2026-07-20 01:19:38', '2026-07-20 01:19:38'),
(254, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 10, 'App\\Models\\Core\\User', 10, '{\"attributes\":{\"email\":\"elfiraworkspace@gmail.com\",\"whatsapp_number\":\"6281231637272\",\"updated_by\":10},\"old\":{\"email\":null,\"whatsapp_number\":\"81231637272\",\"updated_by\":null}}', NULL, '2026-07-20 01:21:05', '2026-07-20 01:21:05'),
(255, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 9, 'App\\Models\\Core\\User', 9, '{\"attributes\":{\"email\":\"19fatonii@gmail.com\",\"whatsapp_number\":\"628813276752\",\"updated_by\":9},\"old\":{\"email\":null,\"whatsapp_number\":\"881-3276-752\",\"updated_by\":null}}', NULL, '2026-07-20 01:21:50', '2026-07-20 01:21:50'),
(256, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 9, 'App\\Models\\Core\\User', 9, '{\"attributes\":{\"avatar_path\":\"core\\/users\\/9\\/avatars\\/01KXYHTZ2ASX12Y40DN84B96H8.png\"},\"old\":{\"avatar_path\":null}}', NULL, '2026-07-20 01:21:52', '2026-07-20 01:21:52'),
(257, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 9, 'App\\Models\\Core\\User', 9, '{\"attributes\":[],\"old\":[]}', NULL, '2026-07-20 01:22:26', '2026-07-20 01:22:26'),
(258, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 12, NULL, NULL, '{\"attributes\":{\"name\":\"azis-designer\",\"username\":\"azis-designer\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:23:52', '2026-07-20 01:23:52'),
(259, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 12, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:23:52', '2026-07-20 01:23:52'),
(260, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 12, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:23:52', '2026-07-20 01:23:52'),
(261, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 12, 'App\\Models\\Core\\User', 12, '{\"attributes\":{\"name\":\"M. Azis Muhemin Tohari\",\"whatsapp_number\":\"82141027799\"},\"old\":{\"name\":\"azis-designer\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:24:31', '2026-07-20 01:24:31'),
(262, 'maintenance-ui', 'Menjalankan maintenance command: migrate', 'App\\Models\\Core\\User', NULL, 1, 'App\\Models\\Core\\User', 1, '{\"ip\":\"103.109.160.134\",\"command\":\"migrate\",\"artisan_command\":\"migrate\",\"output\":\"\\n   INFO  Running migrations.  \\n\\n  2026_07_20_082255_backfill_creative_report_members_for_existing_users  16.22ms DONE\\n\\n\"}', NULL, '2026-07-20 01:27:31', '2026-07-20 01:27:31'),
(263, 'core-user', 'created', 'App\\Models\\Core\\User', 'created', 13, NULL, NULL, '{\"attributes\":{\"name\":\"ganang-video creative\",\"username\":\"ganang-video creative\",\"email\":null,\"whatsapp_number\":null,\"avatar_path\":null,\"created_by\":null,\"updated_by\":null,\"deleted_by\":null}}', NULL, '2026-07-20 01:27:55', '2026-07-20 01:27:55'),
(264, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 13, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:27:55', '2026-07-20 01:27:55'),
(265, 'auth', 'User login', NULL, NULL, NULL, 'App\\Models\\Core\\User', 13, '{\"ip\":\"103.109.160.134\",\"user_agent\":\"Mozilla\\/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit\\/537.36 (KHTML, like Gecko) Chrome\\/150.0.0.0 Safari\\/537.36\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:27:55', '2026-07-20 01:27:55'),
(266, 'core-user', 'updated', 'App\\Models\\Core\\User', 'updated', 13, 'App\\Models\\Core\\User', 13, '{\"attributes\":{\"name\":\"Ganang Syahriar\",\"whatsapp_number\":\"85606374318\"},\"old\":{\"name\":\"ganang-video creative\",\"whatsapp_number\":null}}', NULL, '2026-07-20 01:28:36', '2026-07-20 01:28:36'),
(267, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 13, '{\"ip\":\"103.109.160.134\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:29:10', '2026-07-20 01:29:10'),
(268, 'auth', 'User logout', NULL, NULL, NULL, 'App\\Models\\Core\\User', 13, '{\"ip\":\"103.109.160.134\",\"sub_app\":\"core\"}', NULL, '2026-07-20 01:29:10', '2026-07-20 01:29:10');

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'sub_app',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `frontend_path` varchar(255) DEFAULT NULL,
  `api_prefix` varchar(255) DEFAULT NULL,
  `table_prefix` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `key`, `name`, `display_name`, `type`, `status`, `frontend_path`, `api_prefix`, `table_prefix`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'core', 'Core', 'Core', 'core', 'active', '/dashboard', '/api/v1', NULL, NULL, 10, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(2, 'kv-retail', 'KV Retail Task', 'KV Retail Task', 'sub_app', 'active', '/kv-retail', '/api/v1/kv-retail', 'kv_retail_', NULL, 20, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 'creative-report', 'Creative Report', 'Creative Report', 'sub_app', 'active', '/creative-report', '/api/v1/creative-reports', 'creative_report_', NULL, 30, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'odds', 'One Dashboard Design System', 'One Dashboard Design System', 'sub_app', 'active', '/odds', '/api/v1/odds', 'odds_', NULL, 40, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'generator', 'Generator', 'Generator', 'sub_app', 'active', '/generator', '/api/v1/generator', 'generator_', NULL, 50, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(6, 'cai', 'Creative Artificial Intelligence', 'Creative AI', 'sub_app', 'experimental', '/creative-ai', '/api/v1/cai', 'cai_', NULL, 60, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 'design-assets', 'Design Assets', 'Design Assets', 'sub_app', 'experimental', '/design-assets', '/api/v1/design-assets', 'design_assets_', NULL, 70, '2026-07-15 09:38:18', '2026-07-15 09:38:18');

-- --------------------------------------------------------

--
-- Table structure for table `application_user`
--

CREATE TABLE `application_user` (
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `granted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_user`
--

INSERT INTO `application_user` (`application_id`, `user_id`, `granted_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(2, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(2, 2, 1, '2026-07-15 09:47:54', '2026-07-17 06:21:55'),
(2, 3, 1, '2026-07-15 09:47:54', '2026-07-16 05:31:43'),
(2, 4, 1, '2026-07-19 02:59:27', '2026-07-19 02:59:27'),
(3, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(3, 2, 1, '2026-07-15 09:47:54', '2026-07-17 06:21:55'),
(3, 3, 1, '2026-07-15 09:47:54', '2026-07-16 05:31:43'),
(4, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(4, 2, 1, '2026-07-15 09:47:54', '2026-07-17 06:21:55'),
(4, 3, 1, '2026-07-15 09:47:54', '2026-07-16 05:31:43'),
(4, 4, 1, '2026-07-15 09:47:54', '2026-07-19 02:59:27'),
(4, 5, 5, '2026-07-15 09:47:54', '2026-07-15 09:47:54'),
(5, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(5, 2, 1, '2026-07-15 09:47:54', '2026-07-17 06:21:55'),
(5, 3, 1, '2026-07-15 09:47:54', '2026-07-16 05:31:43'),
(5, 4, 1, '2026-07-15 09:47:54', '2026-07-19 02:59:27'),
(6, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54'),
(7, 1, 1, '2026-07-15 09:38:19', '2026-07-15 09:47:54');

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'emergency_maintenance_mode', '0', '2026-07-15 10:18:35', '2026-07-17 01:21:41');

-- --------------------------------------------------------

--
-- Table structure for table `asset_links`
--

CREATE TABLE `asset_links` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `linkable_type` varchar(255) NOT NULL,
  `linkable_id` bigint(20) UNSIGNED NOT NULL,
  `provider` enum('google_drive','dropbox','onedrive','youtube','other') NOT NULL,
  `label` varchar(255) NOT NULL,
  `url` text NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('76f7884b26aa56626e08f9a9ce8229a9d06eb002', 'i:1;', 1784278243),
('76f7884b26aa56626e08f9a9ce8229a9d06eb002:timer', 'i:1784278243;', 1784278243),
('kv-retail:creative-agent:current', 'a:2:{s:7:\"content\";s:344:\"## Rekomendasi Terkini\n- Tuntaskan **2** task yang terlambat untuk mengurangi penumpukan deadline.  \n- Dorong **5** task yang terhambat di tahap **ACC Draft** agar alur kerja dapat bergerak ke tahap selanjutnya.  \n- Pantau **8** task yang masih dalam proses untuk memastikan progres tepat waktu dan mengidentifikasi potensi bottleneck tambahan.\";s:12:\"generated_at\";s:25:\"2026-07-19T10:00:58+07:00\";}', 1787108458),
('kv-retail:creative-agent:source-hash', 's:64:\"4cb3170bdc8a1446683ee3c1b2576e955dde4a41c897f64d5c8000c9d71be358\";', 1787108458),
('kv-retail:creative-agent:task:1', 'a:2:{s:7:\"content\";s:159:\"- Optimalkan alur persetujuan ACC Draft  \n- Percepat review desain dengan template standar  \n- Gunakan notifikasi otomatis untuk mengingat deadline Kirim Email\";s:12:\"generated_at\";s:25:\"2026-07-18T11:17:09+07:00\";}', 1787026629),
('kv-retail:creative-agent:task:1:source-hash', 's:64:\"fb2ee05867613a790bc759159e8a82455090d922048f52ba0d1bde1c3f91c879\";', 1787026629),
('kv-retail:creative-agent:task:2', 'a:2:{s:7:\"content\";s:200:\"- Percepat review ACC Draft dengan checklist prioritas.  \n- Optimalkan alur Progress Design untuk meminimalkan iterasi ulang.  \n- Gunakan template standar pada Approval Design agar proses lebih cepat.\";s:12:\"generated_at\";s:25:\"2026-07-18T11:06:38+07:00\";}', 1787025998),
('kv-retail:creative-agent:task:2:source-hash', 's:64:\"36431e566495a204bc2d0f38252664f2d337836999ce4579c54d727e80e8ec84\";', 1787025998),
('kv-retail:creative-agent:task:4', 'a:2:{s:7:\"content\";s:225:\"- Terapkan batas waktu standar untuk ACC Draft guna menghindari penundaan.  \n- Gunakan template progres desain untuk mempercepat tahap Progress Design.  \n- Lakukan verifikasi otomatis pada Approval Design sebelum kirim email.\";s:12:\"generated_at\";s:25:\"2026-07-18T11:18:23+07:00\";}', 1787026703),
('kv-retail:creative-agent:task:4:source-hash', 's:64:\"f7e19225bbc889a66eeabdcf962cf1f31370dbb338e0b9076725193355e2dc4f\";', 1787026703),
('salma - designer|103.109.160.134', 'i:2;', 1784510302),
('salma - designer|103.109.160.134:timer', 'i:1784510302;', 1784510302),
('spatie.permission.cache', 'a:3:{s:5:\"alias\";a:5:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";s:1:\"j\";s:15:\"authority_level\";}s:11:\"permissions\";a:38:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:11:\"access-core\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:10:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;i:5;i:6;i:6;i:7;i:7;i:8;i:8;i:9;i:9;i:10;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:12:\"manage-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"manage-roles\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:13:\"approve-users\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:9:\"view-logs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:11:\"run-artisan\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:10:\"access-cai\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:15:\"access-pricetag\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:9:{i:0;i:1;i:1;i:2;i:2;i:3;i:3;i:4;i:4;i:5;i:5;i:6;i:6;i:7;i:7;i:9;i:8;i:10;}}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:15:\"pricetag.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:20:\"kv-retail.tasks.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:6:{i:0;i:1;i:1;i:2;i:2;i:5;i:3;i:6;i:4;i:9;i:5;i:10;}}i:10;a:4:{s:1:\"a\";i:11;s:1:\"b\";s:22:\"kv-retail.tasks.create\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:5;i:3;i:9;}}i:11;a:4:{s:1:\"a\";i:12;s:1:\"b\";s:29:\"kv-retail.tasks.update-status\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:6:{i:0;i:1;i:1;i:2;i:2;i:5;i:3;i:6;i:4;i:9;i:5;i:10;}}i:12;a:4:{s:1:\"a\";i:13;s:1:\"b\";s:22:\"kv-retail.tasks.delete\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:9;}}i:13;a:4:{s:1:\"a\";i:14;s:1:\"b\";s:25:\"kv-retail.settings.manage\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:14;a:4:{s:1:\"a\";i:15;s:1:\"b\";s:32:\"creative-report.assessments.view\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:5;}}i:15;a:4:{s:1:\"a\";i:16;s:1:\"b\";s:34:\"creative-report.assessments.update\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:5;}}i:16;a:4:{s:1:\"a\";i:17;s:1:\"b\";s:11:\"access-odds\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:7:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;i:4;i:6;i:5;i:7;i:6;i:8;}}i:17;a:4:{s:1:\"a\";i:18;s:1:\"b\";s:18:\"manage-odds-config\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:18;a:4:{s:1:\"a\";i:19;s:1:\"b\";s:17:\"create-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:8;}}i:19;a:4:{s:1:\"a\";i:20;s:1:\"b\";s:19:\"view-own-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:8;}}i:20;a:4:{s:1:\"a\";i:21;s:1:\"b\";s:24:\"view-assigned-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:21;a:4:{s:1:\"a\";i:22;s:1:\"b\";s:19:\"view-all-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:22;a:4:{s:1:\"a\";i:23;s:1:\"b\";s:18:\"review-odds-briefs\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:6:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;i:4;i:6;i:5;i:7;}}i:23;a:4:{s:1:\"a\";i:24;s:1:\"b\";s:17:\"manage-odds-queue\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:6:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;i:4;i:6;i:5;i:7;}}i:24;a:4:{s:1:\"a\";i:25;s:1:\"b\";s:23:\"request-odds-queue-skip\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:25;a:4:{s:1:\"a\";i:26;s:1:\"b\";s:22:\"review-odds-queue-skip\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:26;a:4:{s:1:\"a\";i:27;s:1:\"b\";s:16:\"start-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:27;a:4:{s:1:\"a\";i:28;s:1:\"b\";s:19:\"submit-odds-results\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:3:{i:0;i:1;i:1;i:6;i:2;i:7;}}i:28;a:4:{s:1:\"a\";i:29;s:1:\"b\";s:15:\"review-odds-spv\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:29;a:4:{s:1:\"a\";i:30;s:1:\"b\";s:18:\"review-odds-client\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:2:{i:0;i:1;i:1;i:8;}}i:30;a:4:{s:1:\"a\";i:31;s:1:\"b\";s:22:\"request-odds-revisions\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:6;i:2;i:7;i:3;i:8;}}i:31;a:4:{s:1:\"a\";i:32;s:1:\"b\";s:28:\"approve-odds-extra-revisions\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:32;a:4:{s:1:\"a\";i:33;s:1:\"b\";s:29:\"approve-odds-urgent-revisions\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:33;a:4:{s:1:\"a\";i:34;s:1:\"b\";s:17:\"cancel-odds-tasks\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:5:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;i:4;i:8;}}i:34;a:4:{s:1:\"a\";i:35;s:1:\"b\";s:23:\"manage-odds-escalations\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:35;a:4:{s:1:\"a\";i:36;s:1:\"b\";s:17:\"view-odds-reports\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:36;a:4:{s:1:\"a\";i:37;s:1:\"b\";s:18:\"view-odds-rankings\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:4:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;}}i:37;a:4:{s:1:\"a\";i:38;s:1:\"b\";s:11:\"use-odds-ai\";s:1:\"c\";s:3:\"web\";s:1:\"r\";a:6:{i:0;i:1;i:1;i:2;i:2;i:4;i:3;i:5;i:4;i:6;i:5;i:7;}}}s:5:\"roles\";a:10:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:4:\"Root\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:100;}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:7:\"Manajer\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:80;}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:3:\"CEO\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:10:\"Supervisor\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:3:\"SPV\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:60;}i:5;a:4:{s:1:\"a\";i:6;s:1:\"b\";s:8:\"Designer\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:6;a:4:{s:1:\"a\";i:7;s:1:\"b\";s:12:\"Videographer\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:7;a:4:{s:1:\"a\";i:8;s:1:\"b\";s:6:\"Client\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:8;a:4:{s:1:\"a\";i:9;s:1:\"b\";s:13:\"Leader Retail\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}i:9;a:4:{s:1:\"a\";i:10;s:1:\"b\";s:10:\"PIC Retail\";s:1:\"c\";s:3:\"web\";s:1:\"j\";i:0;}}}', 1784516367);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `context_type` varchar(50) NOT NULL DEFAULT 'direct',
  `context_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `closed_at` timestamp NULL DEFAULT NULL,
  `closed_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `context_type`, `context_id`, `status`, `closed_at`, `closed_reason`, `created_at`, `updated_at`) VALUES
(1, 'direct', NULL, 'open', NULL, NULL, '2026-07-17 01:22:18', '2026-07-17 01:22:18');

-- --------------------------------------------------------

--
-- Table structure for table `conversation_user`
--

CREATE TABLE `conversation_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversation_user`
--

INSERT INTO `conversation_user` (`id`, `conversation_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `creative_report_assessments`
--

CREATE TABLE `creative_report_assessments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `creative_report_group_id` bigint(20) UNSIGNED NOT NULL,
  `creative_report_member_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `period` date NOT NULL,
  `creative_scores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`creative_scores`)),
  `leave_count` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `absence_count` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `late_count` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creative_report_assessments`
--

INSERT INTO `creative_report_assessments` (`id`, `creative_report_group_id`, `creative_report_member_id`, `user_id`, `period`, `creative_scores`, `leave_count`, `absence_count`, `late_count`, `status`, `completed_at`, `completed_by`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 6, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:30', '2026-07-20 01:20:30'),
(2, 1, 2, 7, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:32', '2026-07-20 01:20:32'),
(3, 1, 3, 8, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:34', '2026-07-20 01:20:34'),
(4, 1, 4, 9, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:35', '2026-07-20 01:20:35'),
(5, 1, 5, 10, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:37', '2026-07-20 01:20:37'),
(6, 1, 6, 11, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:20:38', '2026-07-20 01:20:38'),
(7, 1, 9, 4, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:27:45', '2026-07-20 01:27:45'),
(8, 2, 8, 3, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:27:46', '2026-07-20 01:27:46'),
(9, 1, 7, 12, '2026-07-01', '[0,0,0,0,0,0,0,0,0,0]', 0, 0, 0, 'draft', NULL, NULL, '2026-07-20 01:27:47', '2026-07-20 01:27:47');

-- --------------------------------------------------------

--
-- Table structure for table `creative_report_groups`
--

CREATE TABLE `creative_report_groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort_order` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creative_report_groups`
--

INSERT INTO `creative_report_groups` (`id`, `name`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Creative Design Production', 3, '2026-07-20 01:20:30', '2026-07-20 01:20:30'),
(2, 'Supervisor Creative Production', 1, '2026-07-20 01:27:46', '2026-07-20 01:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `creative_report_members`
--

CREATE TABLE `creative_report_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `position_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `joined_at` timestamp NULL DEFAULT NULL,
  `resigned_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `creative_report_members`
--

INSERT INTO `creative_report_members` (`id`, `user_id`, `name`, `position_id`, `position_name`, `status`, `joined_at`, `resigned_at`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, 6, 'Richard King Wijaya', 3, 'Designer', 'active', '2026-07-20 01:20:28', NULL, 2, '2026-07-20 01:20:28', '2026-07-20 01:11:27', '2026-07-20 01:20:28'),
(2, 7, 'Muhammad Fadhil Putra Alamsyah', 3, 'Designer', 'active', '2026-07-20 01:20:32', NULL, 2, '2026-07-20 01:20:32', '2026-07-20 01:11:55', '2026-07-20 01:20:32'),
(3, 8, 'Shaloom Justin Fernando', 3, 'Designer', 'active', '2026-07-20 01:20:34', NULL, 2, '2026-07-20 01:20:34', '2026-07-20 01:17:11', '2026-07-20 01:20:34'),
(4, 9, 'Muhammad Ilham Fatoni', 3, 'Designer', 'active', '2026-07-20 01:20:35', NULL, 2, '2026-07-20 01:20:35', '2026-07-20 01:18:00', '2026-07-20 01:20:35'),
(5, 10, 'Salma Maghfira', 3, 'Designer', 'active', '2026-07-20 01:20:37', NULL, 2, '2026-07-20 01:20:37', '2026-07-20 01:18:49', '2026-07-20 01:20:37'),
(6, 11, 'RIZKY JULIAN PRATAMA', 3, 'Designer', 'active', '2026-07-20 01:20:38', NULL, 2, '2026-07-20 01:20:38', '2026-07-20 01:19:09', '2026-07-20 01:20:38'),
(7, 12, 'M. Azis Muhemin Tohari', 3, 'Designer', 'active', '2026-07-20 01:27:47', NULL, 1, '2026-07-20 01:27:47', '2026-07-20 01:24:31', '2026-07-20 01:27:47'),
(8, 3, 'Bobby Linggar', 2, 'SPV', 'active', '2026-07-20 01:27:46', NULL, 1, '2026-07-20 01:27:46', '2026-07-20 01:27:31', '2026-07-20 01:27:46'),
(9, 4, 'Anjas Kurniawan', 3, 'Designer', 'active', '2026-07-20 01:27:45', NULL, 1, '2026-07-20 01:27:45', '2026-07-20 01:27:31', '2026-07-20 01:27:45'),
(10, 13, 'Ganang Syahriar', 4, 'Videographer', 'pending', NULL, NULL, NULL, NULL, '2026-07-20 01:28:36', '2026-07-20 01:28:36');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Accounting', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(2, 'Audit', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 'Business Development', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'Creative', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'Direktur', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(6, 'Doran Care', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 'Finance', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(8, 'General Affair', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(9, 'Gudang', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(10, 'HRD', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(11, 'Keamanan', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(12, 'Kebersihan', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(13, 'Live Streamer', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(14, 'Marketing Digital', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(15, 'Marketing Event', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(16, 'PA of CEO', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(17, 'Pajak', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(18, 'Pengiriman', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(19, 'Product Development', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(20, 'Programmer', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(21, 'Retail', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(22, 'Sales Corporate', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(23, 'Sales Online', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(24, 'Sales Souvenir', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(25, 'Sales Tradisional', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(26, 'SPG DG Mall', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(27, 'SPG DG Street', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(28, 'SPG JETE', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(29, 'SPG JETE Gramedia', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(30, 'Teknisi IT', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(31, 'Transportasi', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(32, 'XSpots', '2026-07-15 09:38:18', '2026-07-15 09:38:18');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generator_pricetag_batches`
--

CREATE TABLE `generator_pricetag_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `total_items` int(11) NOT NULL,
  `processed_items` int(11) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generator_pricetag_batch_items`
--

CREATE TABLE `generator_pricetag_batch_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generator_pricetag_categories`
--

CREATE TABLE `generator_pricetag_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon_svg` mediumtext DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `generator_pricetag_categories`
--

INSERT INTO `generator_pricetag_categories` (`id`, `name`, `icon_svg`, `created_by`, `updated_by`, `deleted_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Smarthome Devices', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(2, 'Smart Wearables', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(3, 'Headphone', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(4, 'Speaker', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(5, 'Mobile Power & Connectivity', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(6, 'Device Tracking', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(7, 'Bag', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(8, 'Computer Peripherals', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(9, 'Storage', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(10, 'Remote Collaboration', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(11, 'Content Creation Essentials', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(12, 'Phone Accessories', NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `generator_pricetag_products`
--

CREATE TABLE `generator_pricetag_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `variant_name` varchar(100) NOT NULL DEFAULT ' ',
  `normal_price` int(11) NOT NULL DEFAULT 0,
  `discount_price` int(11) DEFAULT 0,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `generator_pricetag_products`
--

INSERT INTO `generator_pricetag_products` (`id`, `category_id`, `name`, `variant_name`, `normal_price`, `discount_price`, `created_by`, `updated_by`, `deleted_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'Smart Bulb RGB', 'White', 150000, 120000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(2, 2, 'FitBand Pro Max', 'Black', 500000, NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(3, 3, 'SoundMax Noise Cancelling', ' ', 1200000, 999000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(4, 4, 'BoomBox Mini 360', 'Red', 350000, 300000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(5, 5, 'PowerBank 10000mAh', 'Silver', 250000, NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(6, 6, 'Smart Tag Finder', 'White', 150000, 99000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(7, 7, 'Tech Backpack 15 inch', 'Grey', 450000, 400000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(8, 8, 'Wireless Mouse Silent', 'Black', 120000, NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(9, 9, 'SSD Portable 1TB', 'Black', 1500000, 1350000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(10, 10, 'Webcam 1080p', ' ', 600000, 550000, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(11, 11, 'Ring Light 10 inch', ' ', 100000, NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(12, 12, 'Tempered Glass Premium', 'Clear', 50000, NULL, 1, NULL, NULL, NULL, '2026-07-15 09:38:19', '2026-07-15 09:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kv_retail_tasks`
--

CREATE TABLE `kv_retail_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `legacy_source` varchar(100) DEFAULT NULL,
  `legacy_id` bigint(20) UNSIGNED DEFAULT NULL,
  `task_given_date` date NOT NULL,
  `task_name` varchar(255) NOT NULL,
  `pic_vendor` varchar(255) DEFAULT NULL,
  `deadline_date` date DEFAULT NULL,
  `file_link` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT '0',
  `task_timestamps` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`task_timestamps`)),
  `delay_reasons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`delay_reasons`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `support_file_path` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`support_file_path`)),
  `draft_file_path` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`draft_file_path`)),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kv_retail_tasks`
--

INSERT INTO `kv_retail_tasks` (`id`, `legacy_source`, `legacy_id`, `task_given_date`, `task_name`, `pic_vendor`, `deadline_date`, `file_link`, `status`, `task_timestamps`, `delay_reasons`, `created_at`, `updated_at`, `support_file_path`, `draft_file_path`, `created_by`) VALUES
(1, 'creative-doran-hosting-2026-07-15', 3, '2026-07-11', 'Desain Hoarding JETE Lampung Mall', 'Fushion', '2026-07-11', '\\\\bobby-pc\\Tempat Sharing File\\#DESIGN BOBBY\\#JETE\\HOARDING\\JETE LAMPUNG', 'Done', '{\"ACC Draft\":\"11\\/07\\/2026 14:11\",\"Progress\":\"11\\/07\\/2026 14:11\",\"Approve\":\"11\\/07\\/2026 14:11\",\"Email\":\"11\\/07\\/2026 14:11\"}', NULL, '2026-07-11 07:11:24', '2026-07-18 04:21:23', '[\"homework_tasks\\/3_11-07-2026_Ukuran Hoarding Lampug Mall.png\",null,null]', '[\"kv-retail\\/tasks\\/1\\/drafts\\/01KXSQA7KP1J3BE4N8JP2BW9CR.jpg\",null,null]', 2),
(2, 'creative-doran-hosting-2026-07-15', 8, '2026-07-10', 'Re-Design KV Pakuwon City Mall', 'Fushion', '2026-07-13', NULL, 'Kirim Email', '{\"ACC Draft\":\"13\\/07\\/2026 15:14\",\"Progress\":\"13\\/07\\/2026 15:14\",\"Approve\":\"13\\/07\\/2026 15:14\",\"Email\":\"13\\/07\\/2026 15:14\"}', NULL, '2026-07-13 08:13:57', '2026-07-13 08:14:14', '[\"homework_tasks\\/8_13-07-2026_Screenshot_3.png\",null,null]', '[null,null,null]', 2),
(3, 'creative-doran-hosting-2026-07-15', 9, '2026-07-01', 'Tugas Desain Figura Target 2028', 'Mireco', '2026-07-16', NULL, 'Approval Design', '{\"ACC Draft\":\"13\\/07\\/2026 15:22\",\"Progress\":\"13\\/07\\/2026 15:22\",\"Approve\":\"13\\/07\\/2026 15:22\"}', NULL, '2026-07-13 08:21:55', '2026-07-13 08:22:14', '[\"homework_tasks\\/9_13-07-2026_MOCKUP.jpg\",null,null]', '[null,null,null]', 2),
(4, 'creative-doran-hosting-2026-07-15', 10, '2026-07-06', 'Desain KV & WP Office Bali', 'Mireco', '2026-07-13', '\\\\bobby-pc\\Tempat Sharing File\\#DESIGN BOBBY\\#JETE\\OFFICIAL STORE\\OFFICE BALI\\DG OFFICE BALI', 'Done', '{\"ACC Draft\":\"13\\/07\\/2026 15:26\",\"Progress\":\"13\\/07\\/2026 15:26\",\"Approve\":\"13\\/07\\/2026 15:26\",\"Email\":\"13\\/07\\/2026 15:26\"}', NULL, '2026-07-13 08:26:32', '2026-07-13 08:26:57', '[\"homework_tasks\\/10_13-07-2026_Ilustrasi ( panel )- Lantai 1 - JETE Teuku Umar Bali - 06 Juli 2026.pdf\",null,null]', '[\"homework_tasks\\/10_13-07-2026_Artboard 1.jpg\",null,null]', 2),
(5, 'creative-doran-hosting-2026-07-15', 11, '2026-07-14', 'Desain KV JETE Lampung', 'Fushion', '2026-07-18', '\\\\bobby-pc\\Tempat Sharing File\\#DESIGN BOBBY\\#JETE\\OFFICIAL STORE\\JETE MALL KARTINI LAMPUNG\\300dpi', 'Done', '{\"ACC Draft\":\"16\\/07\\/2026 09:04\",\"Progress\":\"16\\/07\\/2026 09:04\",\"Approve\":\"16\\/07\\/2026 13:25\",\"Email\":\"16\\/07\\/2026 15:26\"}', '{\"ACC Draft\":{\"reason\":\"Menunggu Ukuran dari Fushion\",\"recorded_at\":\"2026-07-16T09:04:36+07:00\"}}', '2026-07-14 03:11:02', '2026-07-16 08:27:02', '[\"homework_tasks\\/11_14-07-2026_Drawing JETE Mall Kartini Lampung REV_080726.pdf\",\"homework_tasks\\/11_14-07-2026_Detail Ukuran.jpeg\",null]', '[\"kv-retail\\/tasks\\/5\\/drafts\\/01KXMCB4Y9NSR7AK352BZZ0RC8.jpg\",null,null]', 2),
(6, 'creative-doran-hosting-2026-07-15', 12, '2026-07-15', 'Penambahan Desain KV BG Junction', 'Mireco', '2026-07-16', '\\\\richard-pc\\Creative Desain\\BOBBY\\OFFICIAL STORE\\JETE\\JETE BG JUNCTION\\EXTENTION', 'Done', '{\"ACC Draft\":\"15\\/07\\/2026 16:51\",\"Progress\":\"15\\/07\\/2026 16:51\",\"Approve\":\"15\\/07\\/2026 16:51\",\"Email\":\"16\\/07\\/2026 09:29\"}', '[]', '2026-07-15 00:53:15', '2026-07-18 04:22:22', '[\"homework_tasks\\/12_15-07-2026_Ilustrasi - JETE BG Junction ( Ekspansi ) - 10 Juni 2026.pdf\",\"homework_tasks\\/12_15-07-2026_Ukuran Kv BGJ Tambahan_20260714_195904_0000.pdf\",null]', '[\"kv-retail\\/tasks\\/6\\/drafts\\/01KXSQC1AF840K1Z3KBEF4584H.jpg\",null,null]', 2),
(7, 'creative-doran-hosting-2026-07-15', 13, '2026-07-15', 'Desain KV JETE Pakuwon Solo', 'Fushion', '2026-07-20', NULL, 'Progress Design', '{\"ACC Draft\":\"15\\/07\\/2026 16:50\",\"Progress\":\"15\\/07\\/2026 16:55\"}', '[]', '2026-07-15 02:40:35', '2026-07-16 02:33:48', '[\"homework_tasks\\/13_15-07-2026_Preview - JETE Pakuwon Solo 13 Juni.pdf\",null,null]', '[\"kv-retail\\/tasks\\/7\\/drafts\\/01KXMCBSVG1MEPZC4GT7BZZBR0.jpg\",null,null]', 2),
(8, NULL, NULL, '2026-07-16', 'Desain KV & Stiker Booth Pameran', 'Fushion', '2026-07-18', NULL, 'Approval Design', '{\"ACC Draft\":\"17\\/07\\/2026 14:36\",\"Progress\":\"17\\/07\\/2026 14:36\",\"Approve\":\"18\\/07\\/2026 11:19\"}', '{\"ACC Draft\":{\"reason\":\"Ada Revisi dari pak Jhonny untuk Draft nya!\",\"recorded_at\":\"2026-07-17T14:36:56+07:00\"}}', '2026-07-16 05:38:34', '2026-07-18 04:19:44', '[\"kv-retail\\/tasks\\/8\\/references\\/01KXMPXWZZ9JQRQ7WN72PRYDVD.png\",\"kv-retail\\/tasks\\/8\\/references\\/01KXMPXYFXPF8B6N056XZMSXD2.pdf\",null]', '[\"kv-retail\\/tasks\\/8\\/drafts\\/01KXQG54XVEXF7MAB2VV19TP6Y.jpg\",null,null]', 2),
(9, NULL, NULL, '2026-07-17', 'Desain KV Case JETE Beachwalk Bali', 'Mireco', '2026-07-21', NULL, 'ACC Draft', '{\"ACC Draft\":\"17\\/07\\/2026 15:23\"}', '[]', '2026-07-17 08:20:26', '2026-07-17 08:23:09', '[\"kv-retail\\/tasks\\/9\\/references\\/01KXQJJZ85FYQ6FW6509VEJ9BE.jpg\",null,null]', '[null,null,null]', 2),
(10, NULL, NULL, '2026-07-17', 'Desain KV JETE Discover Bali', 'Mireco', '2026-07-21', NULL, 'ACC Draft', '{\"ACC Draft\":\"17\\/07\\/2026 15:23\"}', '[]', '2026-07-17 08:21:11', '2026-07-17 08:23:09', '[\"kv-retail\\/tasks\\/10\\/references\\/01KXQJMDBQEMDMWCJTF8MWCCFX.jpg\",null,null]', '[null,null,null]', 2),
(11, NULL, NULL, '2026-07-17', 'Desain KV Case DG TSM Bali', 'Mireco', '2026-07-21', NULL, 'ACC Draft', '{\"ACC Draft\":\"17\\/07\\/2026 15:23\"}', '[]', '2026-07-17 08:22:05', '2026-07-17 08:23:10', '[\"kv-retail\\/tasks\\/11\\/references\\/01KXQJP3CNAFM45Z9TJYWJK0CZ.jpg\",null,null]', '[null,null,null]', 2),
(12, NULL, NULL, '2026-07-17', 'Desain KV DG Mall Galeria Bali', 'Mireco', '2026-07-22', NULL, '0', '[]', NULL, '2026-07-17 08:22:50', '2026-07-17 08:22:50', '[\"kv-retail\\/tasks\\/12\\/references\\/01KXQJQG9MCZSND0GKGNYZT6YJ.jpg\",null,null]', '[null,null,null]', 2);

-- --------------------------------------------------------

--
-- Table structure for table `kv_retail_task_user`
--

CREATE TABLE `kv_retail_task_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `kv_retail_task_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kv_retail_task_user`
--

INSERT INTO `kv_retail_task_user` (`id`, `kv_retail_task_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, NULL, NULL),
(2, 2, 3, NULL, NULL),
(3, 3, 3, NULL, NULL),
(4, 3, 2, NULL, NULL),
(5, 4, 3, NULL, NULL),
(6, 4, 2, NULL, NULL),
(7, 5, 3, NULL, NULL),
(8, 5, 2, NULL, NULL),
(9, 6, 3, NULL, NULL),
(10, 6, 2, NULL, NULL),
(11, 7, 3, NULL, NULL),
(12, 7, 2, NULL, NULL),
(13, 8, 3, NULL, NULL),
(14, 8, 2, NULL, NULL),
(15, 9, 3, NULL, NULL),
(16, 9, 2, NULL, NULL),
(17, 10, 3, NULL, NULL),
(18, 10, 2, NULL, NULL),
(19, 11, 3, NULL, NULL),
(20, 12, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `reply_to_id` bigint(20) UNSIGNED DEFAULT NULL,
  `body` text NOT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `mentioned_user_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`mentioned_user_ids`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_reads`
--

CREATE TABLE `message_reads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `read_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_asset_links_table', 1),
(5, '2026_06_15_061333_create_permission_tables', 1),
(6, '2026_06_15_061343_create_activity_log_table', 1),
(7, '2026_06_15_061344_add_event_column_to_activity_log_table', 1),
(8, '2026_06_15_061345_add_batch_uuid_column_to_activity_log_table', 1),
(9, '2026_06_15_061350_create_notifications_table', 1),
(10, '2026_06_17_000000_create_pricetag_tables', 1),
(11, '2026_06_17_222718_create_pricetag_batch_items_table', 1),
(12, '2026_06_18_205500_add_settings_to_users_table', 1),
(13, '2026_06_18_215000_rename_superadmin_to_root', 1),
(14, '2026_06_19_113928_create_personal_access_tokens_table', 1),
(15, '2026_06_22_094347_add_icon_svg_to_pricetag_categories_table', 1),
(16, '2026_06_22_103807_drop_pending_columns_from_users_table', 1),
(17, '2026_06_23_160532_create_conversations_table', 1),
(18, '2026_06_23_160532_create_messages_table', 1),
(19, '2026_06_23_160533_create_conversation_user_table', 1),
(20, '2026_06_24_000000_update_variant_name_default_on_pricetag_products_table', 1),
(21, '2026_06_26_000000_create_odds_workflow_tables', 1),
(22, '2026_06_26_120000_add_quality_issue_to_odds_workflow', 1),
(23, '2026_06_27_130844_create_divisions_table', 1),
(24, '2026_06_27_130844_create_positions_table', 1),
(25, '2026_06_27_130845_add_onboarding_fields_to_users_table', 1),
(26, '2026_07_01_000000_add_context_fields_to_conversations_table', 1),
(27, '2026_07_10_144915_create_homework_tasks_table', 1),
(28, '2026_07_10_144924_create_homework_task_user_table', 1),
(29, '2026_07_10_151226_add_file_link_to_homework_tasks_table', 1),
(30, '2026_07_11_090836_change_file_paths_to_json_on_homework_tasks_table', 1),
(31, '2026_07_11_092214_create_app_settings_table', 1),
(32, '2026_07_11_112058_add_created_by_to_homework_tasks_table', 1),
(33, '2026_07_14_120000_add_delay_reasons_to_homework_tasks_table', 1),
(34, '2026_07_14_160000_create_creative_report_tables', 1),
(35, '2026_07_14_170000_create_application_registry_tables', 1),
(36, '2026_07_14_180000_rename_homework_tasks_to_kv_retail_tasks', 1),
(37, '2026_07_14_190000_create_stored_files_table', 1),
(38, '2026_07_14_200000_rename_pricetag_tables_to_generator_pricetag', 1),
(39, '2026_07_15_160000_add_legacy_reference_to_kv_retail_tasks_table', 1),
(40, '2026_07_16_090000_make_user_email_nullable_for_doran_login', 2),
(41, '2026_07_16_120000_upgrade_messages_for_collaboration', 2),
(42, '2026_07_17_090000_create_creative_report_members_table', 3),
(43, '2026_07_19_212003_rename_sla_days_to_sla_minutes_on_odds_categories', 4),
(44, '2026_07_19_214233_modify_odds_schema_for_sla_capacity', 4),
(45, '2026_07_19_220236_drop_daily_capacity_minutes_from_odds_designer_profiles', 4),
(46, '2026_07_19_221933_drop_max_active_tasks_from_odds_designer_profiles', 4),
(47, '2026_07_19_225353_add_leave_dates_to_odds_designer_profiles', 4),
(48, '2026_07_20_082255_backfill_creative_report_members_for_existing_users', 5);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_permissions`
--

INSERT INTO `model_has_permissions` (`permission_id`, `model_type`, `model_id`) VALUES
(10, 'App\\Models\\Core\\User', 3),
(11, 'App\\Models\\Core\\User', 3),
(12, 'App\\Models\\Core\\User', 3),
(13, 'App\\Models\\Core\\User', 3),
(17, 'App\\Models\\Core\\User', 2),
(19, 'App\\Models\\Core\\User', 2),
(32, 'App\\Models\\Core\\User', 2),
(33, 'App\\Models\\Core\\User', 2),
(34, 'App\\Models\\Core\\User', 2);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\Core\\User', 1),
(2, 'App\\Models\\Core\\User', 2),
(5, 'App\\Models\\Core\\User', 3),
(6, 'App\\Models\\Core\\User', 4),
(6, 'App\\Models\\Core\\User', 6),
(6, 'App\\Models\\Core\\User', 7),
(6, 'App\\Models\\Core\\User', 8),
(6, 'App\\Models\\Core\\User', 9),
(6, 'App\\Models\\Core\\User', 10),
(6, 'App\\Models\\Core\\User', 11),
(6, 'App\\Models\\Core\\User', 12),
(7, 'App\\Models\\Core\\User', 13),
(8, 'App\\Models\\Core\\User', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('019ec250-7806-4322-b0c3-d19ac8181e88', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 11:00:02', '2026-07-18 11:00:02'),
('02fe2591-5cc0-47c1-a835-4ffb47f11eca', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 16:00:02', '2026-07-18 16:00:02'),
('040f7389-267c-4496-8bee-656be2df7dae', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 17:00:03', '2026-07-19 17:00:03'),
('056e771b-b1a9-4682-b923-904082cade8f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 21:00:04', '2026-07-18 21:00:04'),
('0695e2bd-9618-4250-a913-da26c76d5121', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 22:00:15', '2026-07-18 22:00:15'),
('0798e0ac-9d7c-4a90-9c0e-cbb364055235', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 09:00:02', '2026-07-18 09:00:02'),
('09294af6-e8b9-4705-ab5f-e10fe6105b66', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 20:00:04', '2026-07-18 20:00:04'),
('0a948bbd-5cd5-4d10-920a-bc7008f3168d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 21:00:06', '2026-07-19 21:00:06'),
('0b9a8352-1602-4071-b392-113cfd397aba', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 00:00:04', '2026-07-19 00:00:04'),
('0cddb1b3-6932-476d-85c7-78ea46e330d6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 01:00:04', '2026-07-20 01:00:04'),
('1341971a-cc6a-4d5a-8b76-24a81d806dbb', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 03:00:04', '2026-07-19 03:00:04'),
('134a3861-4d07-4f49-87fb-e8256d2008e2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', '2026-07-19 02:55:52', '2026-07-19 02:00:04', '2026-07-19 02:55:52'),
('13565d1a-5d19-4bc0-8aa6-1fcc0756fed1', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 05:00:03', '2026-07-19 05:00:03'),
('186735c8-e99d-40d1-b102-05bf38e63ecb', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 13:00:05', '2026-07-19 13:00:05'),
('195454c7-adce-4a49-9747-95ba145cb09c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 13:00:05', '2026-07-19 13:00:05'),
('19646224-4f9e-4142-89be-9977f8db603a', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 14:00:03', '2026-07-18 14:00:03'),
('19f07980-7189-4016-8b91-3481b335d30b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 04:00:03', '2026-07-19 04:00:03'),
('1bf3b28a-8df3-4019-bb13-e7c6cec91923', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 16:00:04', '2026-07-19 16:00:04'),
('20cc7c4a-c23a-4612-adb9-b612633d9f8c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 04:00:03', '2026-07-19 04:00:03'),
('20f73a78-1305-4a35-8a99-e0abf786b9b2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 19:00:02', '2026-07-19 19:00:02'),
('21223e30-6b31-46f7-a8a8-0c1a292db1e2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 04:00:02', '2026-07-18 04:00:02'),
('22675287-96ee-49f9-9975-7e97c3856cd6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 17:00:02', '2026-07-18 17:00:02'),
('232b7e17-fca2-40df-837a-b06ffb37dd56', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 01:00:04', '2026-07-20 01:00:04'),
('253b5ed2-573f-416f-b706-eec558806636', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 05:00:03', '2026-07-19 05:00:03'),
('2556683d-5203-4d72-b4bf-385be5e2dc0c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 00:00:04', '2026-07-20 00:00:04'),
('26e1a14c-7923-4c4b-867c-4757f2fa9933', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 06:00:04', '2026-07-19 06:00:04'),
('2803870a-2d21-4f62-b51e-d01a518e9272', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 07:00:04', '2026-07-18 07:00:04'),
('282924cc-5533-4990-a138-060f128c9af6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 21:00:04', '2026-07-18 21:00:04'),
('28321c72-0b37-4bb4-871f-483a671e1c4f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 23:00:07', '2026-07-19 23:00:07'),
('2c163f71-f33b-49ef-83fc-a36591852565', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 11:00:05', '2026-07-19 11:00:05'),
('3217a219-f29e-4008-aea0-0e359d3778ff', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 13:00:03', '2026-07-18 13:00:03'),
('325a821d-9403-47d3-9d42-81770fbe822b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 06:00:02', '2026-07-18 06:00:02'),
('35b58785-7d21-4946-99c2-d132a3bb40a8', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 09:00:02', '2026-07-18 09:00:02'),
('39091011-c2c9-4696-a5ee-cf2f93799c72', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 08:00:04', '2026-07-18 08:00:04'),
('3a7f0b17-5f1a-4059-bf6a-58f5519f7747', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 15:00:08', '2026-07-18 15:00:08'),
('3ad121de-7a04-4fd5-a2dd-c499ebe96914', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 11:00:02', '2026-07-18 11:00:02'),
('3b2e4f5c-9f10-4b56-844f-1d9a8f039787', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 21:00:15', '2026-07-17 21:00:15'),
('3be13a25-884e-4379-9da3-bcdf22caf5c6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 06:00:02', '2026-07-18 06:00:02'),
('3de5aeb5-42ab-49c2-934c-c30d37811678', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 08:00:04', '2026-07-18 08:00:04'),
('3e5b8f72-7f70-4721-beff-6450599bc1e5', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 17:00:03', '2026-07-18 17:00:03'),
('3f14b9b4-0fdb-4e20-a754-6e0cde60ada6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 23:00:03', '2026-07-17 23:00:03'),
('451c899c-55db-4480-ae05-8bf6b9f4c1af', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 18:00:02', '2026-07-18 18:00:02'),
('4a3342c9-c724-4fc1-a26c-24b86a6e1ff2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 00:00:04', '2026-07-20 00:00:04'),
('4b6c0311-441a-468c-aaa5-146e8bf608df', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 07:00:04', '2026-07-19 07:00:04'),
('4bb438f6-fece-46d6-aae8-8bfa338dd5c7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 19:00:02', '2026-07-19 19:00:02'),
('4c780060-fd50-43e6-8cd4-fa0f999a8d8b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 00:00:04', '2026-07-19 00:00:04'),
('4c93377a-a0cd-4153-9942-029ca4e096c6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 13:00:03', '2026-07-18 13:00:03'),
('4f890a37-8e39-41bd-90bd-58f2e961c3cd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 12:00:04', '2026-07-18 12:00:04'),
('4f9bfad8-26a9-47c1-bc6a-329efc1a31bd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 15:00:08', '2026-07-18 15:00:08'),
('4fb38faf-a165-4d4c-a30c-9819e585808c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 20:00:06', '2026-07-17 20:00:06'),
('50800552-c1e6-4f72-a8ad-9cec75818de6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 22:00:14', '2026-07-19 22:00:14'),
('542745b9-3920-4659-89a6-c214c526919d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 19:00:02', '2026-07-17 19:00:02'),
('553cc719-5f4d-4d37-873b-9f7f10a768e4', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 18:00:01', '2026-07-19 18:00:01'),
('56164186-7ce1-43ef-a3af-19693ea7dab2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 22:00:14', '2026-07-17 22:00:14'),
('5624bf6f-dde4-4e85-a1df-9445f5e226e7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 13:00:05', '2026-07-19 13:00:05'),
('573eb009-edee-4428-995a-550839504a5f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 13:00:03', '2026-07-18 13:00:03'),
('5af3d5f6-7c0a-4920-9676-fd4d2acf3f6b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 03:00:02', '2026-07-18 03:00:02'),
('5becda05-83cf-4e34-9367-4aa22d2fe589', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 20:00:04', '2026-07-18 20:00:04'),
('5f1fb345-2a38-44a2-bc47-3dc7da713282', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 18:00:02', '2026-07-17 18:00:02'),
('5f819a85-2bd0-4f9e-aec7-fea49f540cfd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 06:00:04', '2026-07-19 06:00:04'),
('603a706b-b337-4ef8-853a-2594c02ec90b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 14:00:04', '2026-07-19 14:00:04'),
('64831e74-a4ef-49d2-9977-ccb22305e6fa', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 19:00:02', '2026-07-19 19:00:02'),
('6833d086-bdcd-45b1-8275-236bfa0639ef', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 06:00:04', '2026-07-19 06:00:04'),
('68c0424b-405e-4675-9255-0fc3f303aef3', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 16:00:04', '2026-07-19 16:00:04'),
('6b5635f9-86f0-4779-8d0d-6acbd6099219', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 18:00:02', '2026-07-17 18:00:02'),
('6b5eacaa-860c-4a4a-8348-74c13b710807', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 21:00:06', '2026-07-19 21:00:06'),
('6d5febbe-e3e7-432d-ae1e-82b7cd397fe5', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 00:00:02', '2026-07-18 00:00:02'),
('6e581916-9f69-44d3-9f63-9eb91e17367d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 01:00:04', '2026-07-20 01:00:04'),
('710cdf3d-2028-42a9-aaad-baf62cbf8866', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 15:00:04', '2026-07-19 15:00:04'),
('71232c79-685d-4333-ae29-5b2bc8446e3d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 23:00:07', '2026-07-19 23:00:07'),
('7181168c-eaf6-4f07-9a26-4d85539d5226', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 01:00:02', '2026-07-19 01:00:02'),
('734c3731-7052-4809-bac2-7261c130c29c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 12:00:04', '2026-07-18 12:00:04'),
('744bfd5f-8b8f-414a-9930-b26c583caed8', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 10:00:04', '2026-07-18 10:00:04'),
('77f709fd-323c-41da-97be-fbbf4dfe5452', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 11:00:05', '2026-07-19 11:00:05'),
('78738fe2-9269-4b64-ae4e-302ad6a392a7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 08:00:04', '2026-07-18 08:00:04'),
('796d9414-7088-4a34-94d0-a8597de3cec3', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 07:00:03', '2026-07-19 07:00:03'),
('7a3e617c-bea2-4000-b512-894ff64a6f7a', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 23:00:03', '2026-07-17 23:00:03'),
('7b574f2f-5d40-4912-8ab4-15c62021a1ef', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 02:00:04', '2026-07-19 02:00:04'),
('7d8b2852-8e6f-4ddb-9c08-0d82b2ac5d99', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 02:00:02', '2026-07-18 02:00:02'),
('7f8c5226-aca7-4612-8ad4-3d52eceeb5ed', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 23:00:07', '2026-07-18 23:00:07'),
('805b36dc-87f4-44a8-ae9f-51ebeadcc21b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 09:00:02', '2026-07-18 09:00:02'),
('80650d0f-27f5-48f3-a64c-1618a4f00a8b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 18:00:02', '2026-07-18 18:00:02'),
('816ae972-d782-470d-a511-a6d85f60a73b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 15:00:04', '2026-07-19 15:00:04'),
('827f9c25-c05a-4fbe-bc9d-c3bf11c4eddd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 09:00:08', '2026-07-19 09:00:08'),
('83e2c927-c8dc-4b9d-a9fd-f332d001172e', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 18:00:01', '2026-07-19 18:00:01'),
('85b151a4-0dd3-4f16-9d6d-0a72c7721624', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 22:00:14', '2026-07-17 22:00:14'),
('87f85426-75fe-4f8e-a3b5-d90b62334a4a', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 07:00:04', '2026-07-19 07:00:04'),
('88376887-bfa8-4dff-9387-a74ac7dd75d0', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 21:00:15', '2026-07-17 21:00:15'),
('89add8c6-b374-4b9c-9838-b5a4c03e3c9c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 09:00:08', '2026-07-19 09:00:08'),
('8bf17613-0cd5-43c9-a6ff-e7396d592d9f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 14:00:03', '2026-07-18 14:00:03'),
('8c075712-0581-4f8f-a27a-68a126c9ea37', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 10:00:04', '2026-07-19 10:00:04'),
('8dec35e7-db0d-43ee-b1c7-32707035affc', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 20:00:04', '2026-07-19 20:00:04'),
('907618a9-165d-4540-b5a4-16543b7ee7c6', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 03:00:02', '2026-07-18 03:00:02'),
('91728cc8-5fb9-4c26-8d89-5febd3291962', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 17:00:03', '2026-07-19 17:00:03'),
('93e0788b-d863-4774-b122-28e133c2f93d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 08:00:04', '2026-07-19 08:00:04'),
('9de18bd1-412c-4eed-b4da-8d315f6ee778', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_created\",\"title\":\"Brief baru perlu diperiksa\",\"message\":\"Client mengirim brief ODDS baru untuk Anda.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 06:30:44', '2026-07-17 06:30:44'),
('9e6cfeee-42f4-46b0-a378-b4faf4c8318a', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-20 00:00:04', '2026-07-20 00:00:04'),
('9fc622ce-4919-4cbf-865c-d5a5ae42e7dd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 10:00:04', '2026-07-18 10:00:04'),
('a009c56e-17ff-47f5-899a-e081d42bbf0b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 02:00:02', '2026-07-18 02:00:02'),
('a0522c6b-9175-494a-b908-73f649b30055', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 16:00:02', '2026-07-18 16:00:02'),
('a0e028e3-8264-493f-a0d6-37a7b9b28ec7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 07:00:04', '2026-07-18 07:00:04'),
('a10ae04e-cb9b-4f53-a3d0-1f0fffdb41d5', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 10:00:04', '2026-07-19 10:00:04'),
('a1942216-99e9-4768-8842-67dda1949d23', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 08:00:04', '2026-07-19 08:00:04'),
('a2b46500-dc22-4d23-88dc-1f7f8390bf93', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 18:00:01', '2026-07-19 18:00:01'),
('a2f5335a-7bb6-4b76-a487-d0c6de0d51e1', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 23:00:07', '2026-07-18 23:00:07'),
('a6169bab-006d-434d-ae71-91a82e855c40', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 10:00:04', '2026-07-18 10:00:04'),
('a94bb37f-c757-439b-95e3-9d557e101a9f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 12:00:04', '2026-07-18 12:00:04'),
('aa8f7631-37bd-42df-884e-034c67f911cf', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 01:00:02', '2026-07-19 01:00:02'),
('acaa615b-ca76-4d5b-afe4-1f8b924b65e5', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 08:00:04', '2026-07-19 08:00:04'),
('afcecbb7-c141-4da0-a4be-9df1cedbc518', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 14:00:03', '2026-07-18 14:00:03'),
('b1191486-5956-484a-aa60-faec5d674f8e', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 19:00:02', '2026-07-18 19:00:02'),
('b13c99e9-da13-4b6b-b279-609296d01669', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 14:00:04', '2026-07-19 14:00:04'),
('b516fc6a-404f-420f-90de-4cce87cd7c7c', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 00:00:02', '2026-07-18 00:00:02'),
('b5191aa8-ee5e-43d8-8872-6f13140511ec', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 04:00:03', '2026-07-19 04:00:03'),
('b564cbd6-6b6d-409e-beda-51f99aebeba3', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 21:00:06', '2026-07-19 21:00:06'),
('b7bb87df-b8ed-4d6a-8a8d-892a4adc41e7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 19:00:02', '2026-07-18 19:00:02'),
('ba65964d-9263-4093-92ef-c1ae5ca12ae2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 22:00:15', '2026-07-19 22:00:15'),
('bb4c2ef8-1a85-45e4-bc36-e81e040a5526', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 03:00:04', '2026-07-19 03:00:04'),
('bc1a2918-442b-49db-a207-f860e30ce3f0', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 07:00:04', '2026-07-18 07:00:04'),
('bc6ad21d-c679-47ca-8110-24fec11b346e', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 22:00:15', '2026-07-18 22:00:15'),
('bd51aead-dac5-4850-b318-1ee7b04f8034', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 12:00:05', '2026-07-19 12:00:05'),
('be78ca16-708e-4eac-9129-a2996cc5c272', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 17:00:03', '2026-07-17 17:00:03'),
('be94a24b-c8d5-4e12-9142-ab287fe7ff00', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 11:00:05', '2026-07-19 11:00:05'),
('c043b40b-b90d-4368-b4a5-137fa1ef3250', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 01:00:02', '2026-07-19 01:00:02'),
('c39df6b8-9973-48ba-896b-d99a8baee56d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 04:00:02', '2026-07-18 04:00:02'),
('c3f70650-8ff4-4b13-82bc-348d1c0aad2a', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 17:00:03', '2026-07-17 17:00:03'),
('c50aca26-4fc0-4fd7-87c7-8f5d8d4eb740', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 15:00:04', '2026-07-19 15:00:04'),
('c5176ab3-db89-42d8-a496-f8187784cdf3', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 16:00:02', '2026-07-18 16:00:02'),
('c8263a7b-fb81-4a8b-a611-4821134de2b2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 18:00:02', '2026-07-18 18:00:02');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('cabbf457-839a-44d4-88b8-38d03dfd1db8', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 05:00:03', '2026-07-18 05:00:03'),
('cbaa538b-f134-44df-8677-5c5b316a2525', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 23:00:07', '2026-07-18 23:00:07'),
('ce715893-85c0-4974-9743-b45e86819c26', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 05:00:03', '2026-07-19 05:00:03'),
('cfeaa8e0-97bd-4e5a-ba11-f889f0a759c2', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 22:00:14', '2026-07-18 22:00:14'),
('d174b3a7-d9ef-4a1a-bd0d-b6f11063553f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 03:00:04', '2026-07-19 03:00:04'),
('d277af52-27a4-49d0-b046-d1a25eafc886', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 14:00:04', '2026-07-19 14:00:04'),
('d5e0742f-f583-4fe1-96c7-0119728e50c9', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 12:00:05', '2026-07-19 12:00:05'),
('d5f637a8-9ee2-40d2-b3ab-965350cfb02f', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 19:00:02', '2026-07-17 19:00:02'),
('d6525dcc-c21c-4a53-bd49-8c00941f7c88', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 21:00:04', '2026-07-18 21:00:04'),
('d9d3df9d-062f-4693-be26-597905e76f35', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 09:00:08', '2026-07-19 09:00:08'),
('dbaf0dbe-725f-4868-a8e5-082d5b4d55bf', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 17:00:03', '2026-07-18 17:00:03'),
('dbc00479-d553-41a3-a376-2611967922ec', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 23:00:07', '2026-07-19 23:00:07'),
('dee0716d-b67c-42a0-8711-6823b14c1255', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 15:00:08', '2026-07-18 15:00:08'),
('e04e069a-d5b3-41dd-9fa4-65c28ae5ee6b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 01:00:03', '2026-07-18 01:00:03'),
('e1992664-361a-4def-890b-26daea34bd3d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 00:00:04', '2026-07-19 00:00:04'),
('e366413d-bcff-4025-8bfc-67388c9ebb64', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 16:00:04', '2026-07-19 16:00:04'),
('e64eede7-169a-4240-b0b1-89527586f958', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 17:00:03', '2026-07-19 17:00:03'),
('e7af824d-70b6-44c8-a026-b644e9517cb7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 10:00:04', '2026-07-19 10:00:04'),
('e84822e6-a2f7-4d29-b060-27922fcae899', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_created\",\"title\":\"Permintaan ODDS dikirim\",\"message\":\"Permintaan desain berhasil dikirim.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 06:30:44', '2026-07-17 06:30:44'),
('e95aae00-ef2f-4c38-ba44-b0a84e2a44cd', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 19:00:02', '2026-07-18 19:00:02'),
('e983b037-7d73-4b34-88d8-dc626885a11d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 20:00:04', '2026-07-19 20:00:04'),
('efdd100d-5e4b-47dd-8b8c-51aba84f0e7b', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 05:00:03', '2026-07-18 05:00:03'),
('f159b754-aa94-4408-bb35-3d5f7f2f85a7', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 20:00:04', '2026-07-18 20:00:04'),
('f658e6ba-95a0-4ef0-94cb-3000cde07fab', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 01:00:03', '2026-07-18 01:00:03'),
('f72335d6-5e03-4eda-8590-db5df3896e3d', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 20:00:04', '2026-07-19 20:00:04'),
('f8a76623-f19a-4035-a0f7-9c4636a3a455', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-17 20:00:06', '2026-07-17 20:00:06'),
('fbed1920-b3ed-44ef-ae40-c485d1cbd128', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 12:00:05', '2026-07-19 12:00:05'),
('fc4cdc37-e236-4786-8fe3-e90dc32725dc', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-18 11:00:02', '2026-07-18 11:00:02'),
('fcdc3c43-0409-4c81-9df9-cb4be29e37af', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 2, '{\"app\":\"odds\",\"event\":\"task_overdue\",\"title\":\"Task ODDS overdue\",\"message\":\"Task melewati deadline.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 02:00:04', '2026-07-19 02:00:04'),
('fce076d4-5f27-4aec-b465-90e7723b85bb', 'App\\Notifications\\Odds\\OddsWorkflowNotification', 'App\\Models\\Core\\User', 4, '{\"app\":\"odds\",\"event\":\"no_response_reminder\",\"title\":\"Reminder ODDS\",\"message\":\"Task perlu ditindaklanjuti.\",\"task_id\":1,\"task_number\":\"ODDS-260717-0001\",\"url\":\"\\/odds\\/detail?id=1\"}', NULL, '2026-07-19 22:00:15', '2026-07-19 22:00:15');

-- --------------------------------------------------------

--
-- Table structure for table `odds_categories`
--

CREATE TABLE `odds_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `score_weight` decimal(8,2) NOT NULL DEFAULT 1.00,
  `normal_revision_limit` int(10) UNSIGNED NOT NULL DEFAULT 2,
  `sla_minutes` int(10) UNSIGNED NOT NULL DEFAULT 3,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `odds_categories`
--

INSERT INTO `odds_categories` (`id`, `name`, `score_weight`, `normal_revision_limit`, `sla_minutes`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Marketplace Banner', 2.00, 2, 3, 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL),
(2, 'Social Media Feed', 1.50, 2, 2, 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `odds_designer_daily_reports`
--

CREATE TABLE `odds_designer_daily_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `report_date` date NOT NULL,
  `designer_id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `output_done` tinyint(1) NOT NULL DEFAULT 0,
  `active_work_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `revision_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `review_waiting_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `revision_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `overdue` tinyint(1) NOT NULL DEFAULT 0,
  `quality_issue_flag` tinyint(1) NOT NULL DEFAULT 0,
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `final_status` varchar(50) NOT NULL,
  `done_at` timestamp NULL DEFAULT NULL,
  `score` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_designer_profiles`
--

CREATE TABLE `odds_designer_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'available',
  `specializations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specializations`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `leave_dates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`leave_dates`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `odds_designer_profiles`
--

INSERT INTO `odds_designer_profiles` (`id`, `user_id`, `status`, `specializations`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `leave_dates`) VALUES
(1, 4, 'available', '[]', 1, 1, 1, '2026-07-17 01:49:44', '2026-07-17 01:49:44', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `odds_designer_rankings`
--

CREATE TABLE `odds_designer_rankings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `period_type` varchar(20) NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `designer_id` bigint(20) UNSIGNED NOT NULL,
  `total_output` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_score` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total_work_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_revision_duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_revision_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `overdue_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `average_rating` decimal(4,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_system_rules`
--

CREATE TABLE `odds_system_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(120) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `odds_system_rules`
--

INSERT INTO `odds_system_rules` (`id`, `key`, `value`, `description`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'brief_return_limit', '{\"count\":2}', 'Jumlah maksimal brief boleh dikembalikan sebelum eskalasi SPV.', 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL),
(2, 'client_review_timeout_days', '{\"days\":3}', 'Batas client tidak merespons review sebelum auto done.', 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL),
(3, 'no_response_hours', '{\"hours\":24}', 'Batas tidak ada respons sebelum sistem mengirim reminder ODDS.', 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL),
(4, 'leader_revision_quality_issue_limit', '{\"count\":2}', 'Batas wajar revisi SPV sebelum task ditandai sebagai quality issue.', 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-15 09:38:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `odds_tasks`
--

CREATE TABLE `odds_tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_number` varchar(50) NOT NULL,
  `request_type` varchar(20) NOT NULL DEFAULT 'design',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`category_snapshot`)),
  `requester_id` bigint(20) UNSIGNED NOT NULL,
  `preferred_designer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assigned_designer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `design_purpose` varchar(255) NOT NULL,
  `brief_text` text NOT NULL,
  `reference_visual` text DEFAULT NULL,
  `deadline` datetime NOT NULL,
  `important_matrix` varchar(20) NOT NULL DEFAULT 'normal',
  `attachment_notes` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'submitted',
  `task_type` varchar(40) NOT NULL DEFAULT 'new_task',
  `priority_score` decimal(10,2) NOT NULL DEFAULT 0.00,
  `brief_return_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `leader_revision_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `quality_issue_flag` tinyint(1) NOT NULL DEFAULT 0,
  `quality_issue_note` text DEFAULT NULL,
  `normal_revision_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `extra_revision_used_at` timestamp NULL DEFAULT NULL,
  `extra_revision_approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `urgent_revision_used_at` timestamp NULL DEFAULT NULL,
  `urgent_revision_approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `finished_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `done_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancel_reason` text DEFAULT NULL,
  `current_queue_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `odds_tasks`
--

INSERT INTO `odds_tasks` (`id`, `task_number`, `request_type`, `category_id`, `category_snapshot`, `requester_id`, `preferred_designer_id`, `assigned_designer_id`, `design_purpose`, `brief_text`, `reference_visual`, `deadline`, `important_matrix`, `attachment_notes`, `status`, `task_type`, `priority_score`, `brief_return_count`, `leader_revision_count`, `quality_issue_flag`, `quality_issue_note`, `normal_revision_count`, `extra_revision_used_at`, `extra_revision_approved_by`, `urgent_revision_used_at`, `urgent_revision_approved_by`, `started_at`, `finished_at`, `approved_at`, `done_at`, `cancelled_at`, `cancel_reason`, `current_queue_id`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'ODDS-260717-0001', 'design', 2, '{\"id\":2,\"name\":\"Social Media Feed\",\"score_weight\":1.5,\"normal_revision_limit\":2,\"workload_point\":1,\"sla_days\":2}', 2, 4, 4, 'Desain Feed Agustusan', 'fgnm,nhfgnhhrtghddhsfghdfghdgfhdfhgdg', NULL, '2026-07-18 00:00:00', 'normal', NULL, 'submitted', 'new_task', 0.00, 0, 0, 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 2, '2026-07-17 06:30:44', '2026-07-17 06:30:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_briefs`
--

CREATE TABLE `odds_task_briefs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `reference_visual` text DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `last_return_note` text DEFAULT NULL,
  `ai_summary` text DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `odds_task_briefs`
--

INSERT INTO `odds_task_briefs` (`id`, `task_id`, `content`, `reference_visual`, `attachments`, `last_return_note`, `ai_summary`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'fgnm,nhfgnhhrtghddhsfghdfghdgfhdfhgdg', NULL, NULL, NULL, NULL, 2, '2026-07-17 06:30:44', '2026-07-17 06:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_cancel_requests`
--

CREATE TABLE `odds_task_cancel_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `requested_by` bigint(20) UNSIGNED NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_queue`
--

CREATE TABLE `odds_task_queue` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `designer_id` bigint(20) UNSIGNED NOT NULL,
  `queue_status` varchar(30) NOT NULL DEFAULT 'queued',
  `task_type` varchar(40) NOT NULL DEFAULT 'new_task',
  `priority_score` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estimated_start_at` datetime DEFAULT NULL,
  `estimated_finish_at` datetime DEFAULT NULL,
  `skip_reason` text DEFAULT NULL,
  `skipped_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_results`
--

CREATE TABLE `odds_task_results` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `version_number` int(10) UNSIGNED NOT NULL,
  `submitted_by` bigint(20) UNSIGNED NOT NULL,
  `result_notes` text DEFAULT NULL,
  `status` varchar(40) NOT NULL DEFAULT 'pending_spv',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_reviews`
--

CREATE TABLE `odds_task_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `result_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewer_id` bigint(20) UNSIGNED NOT NULL,
  `review_type` varchar(30) NOT NULL,
  `decision` varchar(30) NOT NULL,
  `notes` text DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_revisions`
--

CREATE TABLE `odds_task_revisions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `result_id` bigint(20) UNSIGNED DEFAULT NULL,
  `requested_by` bigint(20) UNSIGNED NOT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `revision_type` varchar(30) NOT NULL,
  `notes` text NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'open',
  `is_urgent_final` tinyint(1) NOT NULL DEFAULT 0,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_skip_requests`
--

CREATE TABLE `odds_task_skip_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `designer_id` bigint(20) UNSIGNED NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `review_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `odds_task_time_logs`
--

CREATE TABLE `odds_task_time_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `designer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `log_type` varchar(30) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `stopped_at` timestamp NULL DEFAULT NULL,
  `duration_seconds` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'access-core', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(2, 'manage-users', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 'manage-roles', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'approve-users', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'view-logs', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(6, 'run-artisan', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 'access-cai', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(8, 'access-pricetag', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(9, 'pricetag.manage', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(10, 'kv-retail.tasks.view', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(11, 'kv-retail.tasks.create', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(12, 'kv-retail.tasks.update-status', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(13, 'kv-retail.tasks.delete', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(14, 'kv-retail.settings.manage', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(15, 'creative-report.assessments.view', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(16, 'creative-report.assessments.update', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(17, 'access-odds', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(18, 'manage-odds-config', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(19, 'create-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(20, 'view-own-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(21, 'view-assigned-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(22, 'view-all-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(23, 'review-odds-briefs', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(24, 'manage-odds-queue', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(25, 'request-odds-queue-skip', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(26, 'review-odds-queue-skip', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(27, 'start-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(28, 'submit-odds-results', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(29, 'review-odds-spv', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(30, 'review-odds-client', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(31, 'request-odds-revisions', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(32, 'approve-odds-extra-revisions', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(33, 'approve-odds-urgent-revisions', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(34, 'cancel-odds-tasks', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(35, 'manage-odds-escalations', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(36, 'view-odds-reports', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(37, 'view-odds-rankings', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(38, 'use-odds-ai', 'web', '2026-07-15 09:38:18', '2026-07-15 09:38:18');

-- --------------------------------------------------------

--
-- Table structure for table `permission_metadata`
--

CREATE TABLE `permission_metadata` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `application_id` bigint(20) UNSIGNED DEFAULT NULL,
  `display_name` varchar(255) NOT NULL,
  `group_key` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_metadata`
--

INSERT INTO `permission_metadata` (`id`, `permission_id`, `application_id`, `display_name`, `group_key`, `description`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Akses Core', 'access', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(2, 2, 1, 'Kelola Pengguna', 'users', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 3, 1, 'Kelola Role & Permission', 'roles', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 4, 1, 'Setujui Pengguna', 'users', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 5, 1, 'Lihat Log Aktivitas', 'audit', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(6, 6, 1, 'Jalankan Maintenance', 'maintenance', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 7, 6, 'Akses Creative AI', 'access', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(8, 8, 5, 'Akses Pricetag Generator', 'pricetag', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(9, 9, 5, 'Kelola Pricetag Generator', 'pricetag', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(10, 10, 2, 'Melihat Tugas KV Retail', 'tasks', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(11, 11, 2, 'Membuat Tugas KV Retail', 'tasks', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(12, 12, 2, 'Memperbarui Status Tugas KV Retail', 'tasks', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(13, 13, 2, 'Menghapus Tugas KV Retail', 'tasks', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(14, 14, 2, 'Mengelola Pengaturan KV Retail', 'settings', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(15, 15, 3, 'Melihat Penilaian Creative', 'assessments', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(16, 16, 3, 'Mengisi Penilaian Creative', 'assessments', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(17, 17, 4, 'Access Odds', 'odds', NULL, 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(18, 18, 4, 'Manage Odds Config', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(19, 19, 4, 'Create Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(20, 20, 4, 'View Own Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(21, 21, 4, 'View Assigned Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(22, 22, 4, 'View All Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(23, 23, 4, 'Review Odds Briefs', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(24, 24, 4, 'Manage Odds Queue', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(25, 25, 4, 'Mengajukan Skip Antrean ODDS', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(26, 26, 4, 'Meninjau Skip Antrean ODDS', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(27, 27, 4, 'Start Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(28, 28, 4, 'Submit Odds Results', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(29, 29, 4, 'Review Odds Spv', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(30, 30, 4, 'Review Odds Client', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(31, 31, 4, 'Request Odds Revisions', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(32, 32, 4, 'Approve Odds Extra Revisions', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(33, 33, 4, 'Approve Odds Urgent Revisions', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(34, 34, 4, 'Cancel Odds Tasks', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(35, 35, 4, 'Manage Odds Escalations', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(36, 36, 4, 'View Odds Reports', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(37, 37, 4, 'View Odds Rankings', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19'),
(38, 38, 4, 'Use Odds Ai', 'odds', NULL, 0, '2026-07-15 09:38:19', '2026-07-15 09:38:19');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `division_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `name`, `division_id`, `created_at`, `updated_at`) VALUES
(1, 'Manajer', 4, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(2, 'SPV', 4, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(3, 'Designer', 4, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'Videographer', 4, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'Manager', 10, '2026-07-15 09:47:54', '2026-07-15 09:47:54');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `authority_level` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `authority_level`, `created_at`, `updated_at`) VALUES
(1, 'Root', 'web', 100, '2026-07-15 09:38:18', '2026-07-15 09:47:54'),
(2, 'Manajer', 'web', 80, '2026-07-15 09:38:18', '2026-07-15 09:47:54'),
(3, 'CEO', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(4, 'Supervisor', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(5, 'SPV', 'web', 60, '2026-07-15 09:38:18', '2026-07-15 09:47:54'),
(6, 'Designer', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(7, 'Videographer', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(8, 'Client', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(9, 'Leader Retail', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18'),
(10, 'PIC Retail', 'web', 0, '2026-07-15 09:38:18', '2026-07-15 09:38:18');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(2, 1),
(2, 2),
(3, 1),
(4, 1),
(4, 2),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(8, 7),
(8, 9),
(8, 10),
(9, 1),
(9, 2),
(10, 1),
(10, 2),
(10, 5),
(10, 6),
(10, 9),
(10, 10),
(11, 1),
(11, 2),
(11, 5),
(11, 9),
(12, 1),
(12, 2),
(12, 5),
(12, 6),
(12, 9),
(12, 10),
(13, 1),
(13, 2),
(13, 9),
(14, 1),
(14, 2),
(15, 1),
(15, 2),
(15, 5),
(16, 1),
(16, 2),
(16, 5),
(17, 1),
(17, 2),
(17, 4),
(17, 5),
(17, 6),
(17, 7),
(17, 8),
(18, 1),
(18, 2),
(18, 4),
(18, 5),
(19, 1),
(19, 8),
(20, 1),
(20, 8),
(21, 1),
(21, 6),
(21, 7),
(22, 1),
(22, 2),
(22, 4),
(22, 5),
(23, 1),
(23, 2),
(23, 4),
(23, 5),
(23, 6),
(23, 7),
(24, 1),
(24, 2),
(24, 4),
(24, 5),
(24, 6),
(24, 7),
(25, 1),
(25, 6),
(25, 7),
(26, 1),
(26, 2),
(26, 4),
(26, 5),
(27, 1),
(27, 6),
(27, 7),
(28, 1),
(28, 6),
(28, 7),
(29, 1),
(29, 2),
(29, 4),
(29, 5),
(30, 1),
(30, 8),
(31, 1),
(31, 6),
(31, 7),
(31, 8),
(32, 1),
(32, 2),
(32, 4),
(32, 5),
(33, 1),
(33, 2),
(33, 4),
(33, 5),
(34, 1),
(34, 2),
(34, 4),
(34, 5),
(34, 8),
(35, 1),
(35, 2),
(35, 4),
(35, 5),
(36, 1),
(36, 2),
(36, 4),
(36, 5),
(37, 1),
(37, 2),
(37, 4),
(37, 5),
(38, 1),
(38, 2),
(38, 4),
(38, 5),
(38, 6),
(38, 7);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('ADzriBd7PR0e6jCWe2wNOeytQhmIFLqLDhubzRTQ', NULL, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOGF0VEQ3NGd3dGxwdDJWS2g5T2ZGaGRQenVvYzJmSlRoWFVmUkdwMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL2F1dGgvbWUiO319', 1784510951),
('AqHdoKIvkFeicZFPaHyOwLBseQwCAgTrxCxtxtCn', 9, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiUDZBZ1NKeGZVY0YyenBTSjJ0eXdrbTVwUmdncENhRVg4OWhhSUxVNCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo5O3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkRU9yRUxQdVZpaUVQenlKbElTL1p3dVdNTTl5UkNUSDZrelQ2RUlMYzRUNVlYQUgyRlVIVXUiO30=', 1784510601),
('f9T4YVqAjpm9YWesELvS0WT3nHD1nwGekav4e5nX', NULL, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOWtqbDZqU09YRFJhOUJna2VuU3k3VFhFRk1BNEtCQWgyaTdSSUVEZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL2F1dGgvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1784509821),
('kHrzoffOHnjTsudOBY9zWqVea4hwpKztw9zx1LhX', 6, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiZ1lZaTZud1pOZ01mQjJwT1RKMk05dnY3T040cnUyZlpVa3ZYdjRGeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo2O3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkc2dMY0tOaU1nLjhjMVJLRnBBaHRhZS9aR1pYQTBzeFhqTGdyT2g2L29GR2wzRFJxT2w3aC4iO30=', 1784510987),
('Kk3g5wl4GpJbZ2xemSNSkXIz1vCbJjHAlnZ90kUW', 7, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiQnhQMlB5eldBT1lpRVZud050ZmNBaEVnUDhpNmtZYTdwUFYwalJaaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo3O3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkdlczNHR5OVV0aUVqU3luT0w1bjdkLm9KRlNLMFhwQXAwN1VYSlRjUEduVEh5ZWNKZUttdHkiO30=', 1784511026),
('l4dDGA63FWm13Afx5qWcKrKpMtQWlEChl4Tro2Ta', 1, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoieG1EaFJhY2luU2p0OTlNOU9qU2Y3YjVZNnhFV012V1BEMUdFNXpUMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkNmJSaXdUMk9MVFhacTlPQ3REc2FvT2hKTHEyTEpILlBRc1F2TUljT0o4eXpYSElCZUoyYy4iO30=', 1784511037),
('n7AEShu0AsSy6WWfjcK92YfG9iR9qcs6nQyYJpUn', 12, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoibFRSajRKTmVTdGVtNzBibkVPYThmZkxmMkpxYTUwWVVaQkd1aDNuNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJGlPSFd2cTMvNndGNXY0b3JubEhkTGVZTVgvUFlIRE9NQUJrMzhtME0vaHc4a05tVDlQVUcuIjt9', 1784511038),
('pGdQAxTW40ujpG3YlxjvHyc640Rgp0kAO4IFXXH2', NULL, '114.5.241.254', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDZnbXo3TEw5MXBaNkJLeW43Z0pqdWRTQUpCYXdRaEZoRFJDQXhGMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDA6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL2F1dGgvbWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1784509855),
('rLImuYyQVUL38a03hxIVOmk5VzFS5MU0V7uLA81K', 10, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiS3M3TnF0T3cxY1A2TE02M1dLYUgwNFZSWkJ1Q3V0VDhRbmNEOE00ViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMDtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJHp4ZW44QnpuL3lyNGtlSloua3VvTnVqcXRvdi5QVy5IakVNTWUuTlk3ZnRmdFpzbVNHektPIjt9', 1784510980),
('rQHXXf9CIlhySLG0D5bMzmflqpc4Nys7LtPAOCA8', 2, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiakdoN293cVNkT2ZTR29ocjBKd0JpTlVNQ2g1QlRXcDZIc3NpZFptQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NzE6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL2NyZWF0aXZlLXJlcG9ydHMvdXNlcnMvOD9tb250aD0yMDI2LTA3Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJHJLLnNmakFaaUtHbXo3OXZCclIwamUxekhLRW1KZldnQTVHSEdRWVdYQnltLkdBdjcyNnVPIjt9', 1784510932),
('Sj59zWvc76YdznXJ0QokSGO0dQ5pz7BsxBb5ym7m', 10, '103.109.160.134', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiRUJ1MnVSWHZSeGVsOXZCcm9mUGVCTndJZ3Uzd3I3MVVjVVRZQzM3eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMDtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJHp4ZW44QnpuL3lyNGtlSloua3VvTnVqcXRvdi5QVy5IakVNTWUuTlk3ZnRmdFpzbVNHektPIjt9', 1784510481),
('xN7K1Jh7wQynFOhCu038zqQGCPQbg3gdQdDHihd7', 11, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSlJtREpPbDdydFNvTDFMa3hnalFLeE9nYjBldjloeVB5OGZBQ3BPaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMTtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJENJVWE4eVBQaVpMMWFXbU9lSFR3ay5nZW8xRkR2OFVZbFVybVFZUGxMVWFRdm9kYWxIdUVXIjt9', 1784510987),
('Z4YjvQKMsgNZ1hd70aghuhjXh0rVbAKKbDRIw9GE', 8, '103.109.160.134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoic25tZmhOVUhjYUVtWmdkVjloYTViSTdsM0s5NDFiZm5MTnNjS293ciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDY6Imh0dHBzOi8vY3JlYXRpdmUuZG9yYW4uaWQvYXBpL3YxL25vdGlmaWNhdGlvbnMiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTo4O3M6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkTEN2TEdiVFhrTGxBNDdjaEd1OWt4ZVVodFVnc0wuZkx6TTFCa3d0UXRZN0xPY0p0RGQxcC4iO30=', 1784510978);

-- --------------------------------------------------------

--
-- Table structure for table `stored_files`
--

CREATE TABLE `stored_files` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_key` varchar(80) NOT NULL,
  `context_type` varchar(120) NOT NULL,
  `context_id` varchar(120) DEFAULT NULL,
  `category` varchar(80) NOT NULL,
  `disk` varchar(80) NOT NULL,
  `visibility` varchar(20) NOT NULL DEFAULT 'public',
  `original_name` varchar(500) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `path` varchar(1000) NOT NULL,
  `path_hash` varchar(64) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `extension` varchar(30) DEFAULT NULL,
  `size` bigint(20) UNSIGNED NOT NULL,
  `checksum_sha256` varchar(64) NOT NULL,
  `uploaded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stored_files`
--

INSERT INTO `stored_files` (`id`, `application_key`, `context_type`, `context_id`, `category`, `disk`, `visibility`, `original_name`, `stored_name`, `path`, `path_hash`, `mime_type`, `extension`, `size`, `checksum_sha256`, `uploaded_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'kv-retail', 'tasks', '5', 'drafts', 'public', 'public', 'Materi Mockup JETE Lampung.jpg', '01KXMCB4Y9NSR7AK352BZZ0RC8.jpg', 'kv-retail/tasks/5/drafts/01KXMCB4Y9NSR7AK352BZZ0RC8.jpg', '5cb9962c3f23a9f56b3624274de4541aad6d6b7fe5bbb8d6175c5003015bf264', 'image/jpeg', 'jpg', 5845220, '8fd7bf5d8dab00e537fd39289a860e6e5efd442f00e30ed0d5d44149feff4b26', 2, '2026-07-16 02:33:26', '2026-07-16 02:33:26', NULL),
(2, 'kv-retail', 'tasks', '7', 'drafts', 'public', 'public', 'DRAFT JETE PAKUWON SOLO.jpg', '01KXMCBSVG1MEPZC4GT7BZZBR0.jpg', 'kv-retail/tasks/7/drafts/01KXMCBSVG1MEPZC4GT7BZZBR0.jpg', '37544d7716ee62b9a5c11cf83f3ff544510d0c9aadd87d557f21015df54b8e40', 'image/jpeg', 'jpg', 3159670, '907fc760e932f01798a75f0c55d42d300aa73e8c5359ad573c5938968d2f0347', 2, '2026-07-16 02:33:48', '2026-07-16 02:33:48', NULL),
(3, 'kv-retail', 'temporary-uploads', '2', 'pending', 'public', 'public', 'Ukuran Neon Box dan Stiker.png', '01KXMP90GDDMCV839BHQWE8680.png', 'kv-retail/temporary-uploads/2/pending/01KXMP90GDDMCV839BHQWE8680.png', 'eee2b2a78c06097c731a0ddcdabe282421005d2bcfbb49b6041e93de9b349bb4', 'image/png', 'png', 90866, '5046f2485b66e777eff6047d7855b58c5c8f33b9adb3b24f5ed8ee3a73a4e21e', 2, '2026-07-16 05:27:02', '2026-07-16 05:27:02', NULL),
(4, 'kv-retail', 'temporary-uploads', '2', 'pending', 'public', 'public', 'Drawing JETE Doran Pameran.pdf', '01KXMP92411YMCFRQDJJVV0ZPP.pdf', 'kv-retail/temporary-uploads/2/pending/01KXMP92411YMCFRQDJJVV0ZPP.pdf', '59132cba54355fadfa09313dd20b17143d6590eaa139317afb3cbc7385193756', 'application/pdf', 'pdf', 981512, 'fdfb4b3ba95819aa8f222659f8923e4c83c01ef4224de9550c5e509cf1e2b849', 2, '2026-07-16 05:27:04', '2026-07-16 05:27:04', NULL),
(5, 'kv-retail', 'tasks', '8', 'references', 'public', 'public', 'Ukuran Neon Box dan Stiker.png', '01KXMPXWZZ9JQRQ7WN72PRYDVD.png', 'kv-retail/tasks/8/references/01KXMPXWZZ9JQRQ7WN72PRYDVD.png', 'd2b473fad346abc1a18ba9215504b1bf38bea9a0d0eb6444e1a2d55c6e914acf', 'image/png', 'png', 90866, '5046f2485b66e777eff6047d7855b58c5c8f33b9adb3b24f5ed8ee3a73a4e21e', 2, '2026-07-16 05:38:26', '2026-07-16 05:38:34', NULL),
(6, 'kv-retail', 'tasks', '8', 'references', 'public', 'public', 'Drawing JETE Doran Pameran.pdf', '01KXMPXYFXPF8B6N056XZMSXD2.pdf', 'kv-retail/tasks/8/references/01KXMPXYFXPF8B6N056XZMSXD2.pdf', 'a94a96e5e29fb65828c33b1295c7bc94dbb9b702be0d46b9899e27af66f2cba3', 'application/pdf', 'pdf', 981512, 'fdfb4b3ba95819aa8f222659f8923e4c83c01ef4224de9550c5e509cf1e2b849', 2, '2026-07-16 05:38:28', '2026-07-16 05:38:34', NULL),
(7, 'kv-retail', 'tasks', '8', 'drafts', 'public', 'public', 'Materi Draft KV dan Stiker Booth Pameran.jpg', '01KXQG54XVEXF7MAB2VV19TP6Y.jpg', 'kv-retail/tasks/8/drafts/01KXQG54XVEXF7MAB2VV19TP6Y.jpg', '1565ac933d6435e11ef9887274856a4f49160e0a95f4bd6504b5b76722c7d035', 'image/jpeg', 'jpg', 779123, 'c9043c2e514b7f0808687a07e3b6bfc41cc37912cdc5eaf3bce06c0202420eee', 2, '2026-07-17 07:37:47', '2026-07-17 07:37:47', NULL),
(8, 'kv-retail', 'tasks', '9', 'references', 'public', 'public', 'JETE Beachwalk.jpeg', '01KXQJJZ85FYQ6FW6509VEJ9BE.jpg', 'kv-retail/tasks/9/references/01KXQJJZ85FYQ6FW6509VEJ9BE.jpg', '8e0a1877ee773dcbc8b2af5d2a9da61bdabd2a680972ce6fa78656af931ace19', 'image/jpeg', 'jpg', 61676, '644c34a501ef80169d493b079b1d6b83d7e47e4d2692e43c3b58a86a558194b2', 2, '2026-07-17 08:20:17', '2026-07-17 08:20:26', NULL),
(9, 'kv-retail', 'tasks', '10', 'references', 'public', 'public', 'JETE Discovery Bali.jpeg', '01KXQJMDBQEMDMWCJTF8MWCCFX.jpg', 'kv-retail/tasks/10/references/01KXQJMDBQEMDMWCJTF8MWCCFX.jpg', '6a266e320703be3b66815d54c575063159b55fe196ddf4fe7f27fc2945ba6666', 'image/jpeg', 'jpg', 75424, '61db7ba20a6e72951ccf4b65c94c97a69990cd3ef83c8a3e2ebedb0cae319141', 2, '2026-07-17 08:21:05', '2026-07-17 08:21:11', NULL),
(10, 'kv-retail', 'tasks', '11', 'references', 'public', 'public', 'DG TSM Bali.jpeg', '01KXQJP3CNAFM45Z9TJYWJK0CZ.jpg', 'kv-retail/tasks/11/references/01KXQJP3CNAFM45Z9TJYWJK0CZ.jpg', 'aae5b55cfdcad7165b3a6e2e1f7f8f6a7f4c352399e11ecf450bb297f7b3a714', 'image/jpeg', 'jpg', 87187, '8e13a0780c91e1f46ef2a46cf7f6cb37081921e9a4cd454fb5445ef9fa5b96f4', 2, '2026-07-17 08:22:00', '2026-07-17 08:22:05', NULL),
(11, 'kv-retail', 'tasks', '12', 'references', 'public', 'public', 'DG MBG.jpeg', '01KXQJQG9MCZSND0GKGNYZT6YJ.jpg', 'kv-retail/tasks/12/references/01KXQJQG9MCZSND0GKGNYZT6YJ.jpg', '0630a3df30085b651ec067a924da35db0d3f8b7c86691975475b8f10bc482299', 'image/jpeg', 'jpg', 97300, '0200d0ffd821c5a439fcda357ff493f9c5536f03fc6f2eefe742dc8e037a79c2', 2, '2026-07-17 08:22:46', '2026-07-17 08:22:50', NULL),
(12, 'kv-retail', 'tasks', '1', 'drafts', 'public', 'public', 'Materi Mockup JETE Lampung.jpg', '01KXSQA7KP1J3BE4N8JP2BW9CR.jpg', 'kv-retail/tasks/1/drafts/01KXSQA7KP1J3BE4N8JP2BW9CR.jpg', 'e872e98d2aa457e3da67614a3de7e7afbfdae39f03654c8b33690e31654effbf', 'image/jpeg', 'jpg', 5845220, '8fd7bf5d8dab00e537fd39289a860e6e5efd442f00e30ed0d5d44149feff4b26', 2, '2026-07-18 04:21:23', '2026-07-18 04:21:23', NULL),
(13, 'kv-retail', 'tasks', '6', 'drafts', 'public', 'public', 'Draft Final KV BGJ Extension.jpeg', '01KXSQC1AF840K1Z3KBEF4584H.jpg', 'kv-retail/tasks/6/drafts/01KXSQC1AF840K1Z3KBEF4584H.jpg', '08c3a4c8f86ad251f0e9f849797b08927886b5ebe17ce09539400db538ff4b63', 'image/jpeg', 'jpg', 335380, '771e4c6d8946ea066d4920618eb9607cfd21d1adc5db1b0dea6f31bc9da19b35', 2, '2026-07-18 04:22:22', '2026-07-18 04:22:22', NULL),
(14, 'core', 'users', '1', 'avatars', 'public', 'public', 'Screenshot_2026-07-11-18-42-11-542_com.instagram.android.jpg', '01KXW4PKSGZJWCXXSVSBJNX2WV.jpg', 'core/users/1/avatars/01KXW4PKSGZJWCXXSVSBJNX2WV.jpg', '6ef7c6d23d56ee59c8150bac5ace16943ef031ecfadc60e3dc17e34e8537135c', 'image/jpeg', 'jpg', 26139, 'ffb2e1e16e7828fdfb3a75e80d5562092060348cc4c53570468d8a53f619e3a2', 1, '2026-07-19 02:53:49', '2026-07-19 02:54:21', '2026-07-19 02:54:21'),
(15, 'core', 'users', '1', 'avatars', 'public', 'public', 'IMG_20260611_081517_887.jpg', '01KXW4QK3A97KR8V4YWD2F6YR1.jpg', 'core/users/1/avatars/01KXW4QK3A97KR8V4YWD2F6YR1.jpg', '245a72c43556402f7949b5f7e8ae15fefea481481da09306b8cdb587767e7ad8', 'image/jpeg', 'jpg', 28848, '44afcc3e29ceda6751c1c87754038c342b1bb3c55bde3cff4dc1160956561646', 1, '2026-07-19 02:54:21', '2026-07-19 02:54:21', NULL),
(16, 'core', 'users', '4', 'avatars', 'public', 'public', '783EEC9F-E3C5-441E-95C6-D76D6D2B1066.jpg', '01KXW4XMGR0PBX16WXGPS68RSK.jpg', 'core/users/4/avatars/01KXW4XMGR0PBX16WXGPS68RSK.jpg', '441ccb6cbf58aedf65f5d9619c75502c9865e34f3f52d0343c234ff293610109', 'image/jpeg', 'jpg', 31830, '741d59bfbf45dbd85e131d0155c61ea7433ea76c28ac23e11efd1605d017e904', 4, '2026-07-19 02:57:39', '2026-07-19 02:57:39', NULL),
(17, 'core', 'users', '2', 'avatars', 'public', 'public', 'ChatGPT Image Jul 14, 2026, 02_04_44 PM.png', '01KXYGVTTZKRGFT8C1Y5S1WBQ5.png', 'core/users/2/avatars/01KXYGVTTZKRGFT8C1Y5S1WBQ5.png', '188fda627f11286156d1cc8de4d1d44f86084d885595c98a3bdc337164728ed9', 'image/png', 'png', 375038, 'a79c8486ac18a8438deb25820973b2b0106033fa7b20e00978480f049737595a', 2, '2026-07-20 01:04:52', '2026-07-20 01:04:52', NULL),
(18, 'core', 'users', '6', 'avatars', 'public', 'public', 'file_00000000622081fa9101817e1f202093.png', '01KXYHBXF6KW9KWQT1ZAV23HA9.png', 'core/users/6/avatars/01KXYHBXF6KW9KWQT1ZAV23HA9.png', 'ec96e0a17d5dcac5491d2d3d6c76966b9ed71702f9c32483504074b12d8d53d7', 'image/png', 'png', 424294, 'a72e90d9e43c788a953d6d865a0d33553dc09516f6232a2d53cd52c0f8a11333', 6, '2026-07-20 01:13:39', '2026-07-20 01:13:39', NULL),
(19, 'core', 'users', '8', 'avatars', 'public', 'public', 'Artboard 1.jpg', '01KXYHMRZV6MAV2B9DS4NKEPQJ.jpg', 'core/users/8/avatars/01KXYHMRZV6MAV2B9DS4NKEPQJ.jpg', '81d198ca0f46da92968ccb2de78db7558ca6d08831ccd07d6c00a39ab52ce1d6', 'image/jpeg', 'jpg', 39478, '7e893bb634ad053b827a35c6b607411e562f97e12236a1949203bc6624318684', 8, '2026-07-20 01:18:29', '2026-07-20 01:18:29', NULL),
(20, 'core', 'users', '9', 'avatars', 'public', 'public', 'ChatGPT Image 23 Mei 2026, 11.14.18.png', '01KXYHTZ2ASX12Y40DN84B96H8.png', 'core/users/9/avatars/01KXYHTZ2ASX12Y40DN84B96H8.png', '874027e63a0d1ccf07dc629d5a7c0fbd29d1da942c9795bf2b07e3ab76e98279', 'image/png', 'png', 340599, 'e937c2a24063ef577a05f3552588867c22119b3ea9b57497ed3e70255c5255b1', 9, '2026-07-20 01:21:52', '2026-07-20 01:21:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `whatsapp_number` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_onboarded` tinyint(1) NOT NULL DEFAULT 1,
  `division_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position_id` bigint(20) UNSIGNED DEFAULT NULL,
  `avatar_path` varchar(500) DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_by` bigint(20) UNSIGNED DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `email`, `whatsapp_number`, `password`, `is_onboarded`, `division_id`, `position_id`, `avatar_path`, `settings`, `created_by`, `updated_by`, `deleted_by`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'System Admin', 'root', 'root@gmail.com', NULL, '$2y$12$6bRiwT2OLTXZq9OCtDsaoOhJLq2LJH.PQsQvMIcOJ8yzXHIBeJ2c.', 1, NULL, NULL, 'core/users/1/avatars/01KXW4QK3A97KR8V4YWD2F6YR1.jpg', '{\"manageable_manager_permissions\":[\"access-core\",\"manage-users\",\"approve-users\",\"access-pricetag\",\"pricetag.manage\"],\"theme\":\"dark\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false}', NULL, 1, NULL, NULL, '2026-07-15 09:38:18', '2026-07-19 02:54:27'),
(2, 'Rohmat Emha', 'rohmat', 'torot62@gmail.com', '6285640442186', '$2y$12$rK.sfjAZiKGmz79vBrR0je1zHKEmJfWgA5GHGQYWXBym.GAv726uO', 1, 4, 1, 'core/users/2/avatars/01KXYGVTTZKRGFT8C1Y5S1WBQ5.png', '{\"theme\":\"system\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false}', NULL, 2, NULL, NULL, '2026-07-11 07:07:16', '2026-07-20 01:04:52'),
(3, 'Bobby Linggar', 'bobby-designer', NULL, '62895392710209', '$2y$12$br.oCf6dBkuSGqg8ASyscuT3OoBo6UE4Tge3jOn75cvMJK3oDeTT6', 1, 4, 2, NULL, NULL, NULL, 1, NULL, NULL, '2026-07-13 00:51:35', '2026-07-16 05:31:43'),
(4, 'Anjas Kurniawan', 'anjas-designer', 'anjaskurniawan737@gmail.com', '62895809462040', '$2y$12$.YtcpoURyCu6Ah6MKwFw3OLoUKCGjmYA3U5lDMeruzMe7zP/Tm6/q', 1, 4, 3, 'core/users/4/avatars/01KXW4XMGR0PBX16WXGPS68RSK.jpg', '{\"theme\":\"system\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false}', NULL, 1, NULL, NULL, '2026-07-13 08:11:05', '2026-07-19 02:59:27'),
(5, 'Yulianita Merlina', 'Yulia-HRD', NULL, '81336120330', '$2y$12$uX1XNaSq4lcH.EGBLwplFeJhK0.bodgbfOyQ9ZFv.IAF.WTFWSYoq', 1, 10, 5, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-15 02:51:18', '2026-07-15 02:51:53'),
(6, 'Richard King Wijaya', 'Richard-Designer', 'richardkingwijaya@gmail.com', '6289520220605', '$2y$12$sgLcKNiMg.8c1RKFpAhtae/ZGZXA0sxXjLgrOh6/oFGl3DRqOl7h.', 1, 4, 3, 'core/users/6/avatars/01KXYHBXF6KW9KWQT1ZAV23HA9.png', '{\"theme\":\"dark\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false}', NULL, 6, NULL, NULL, '2026-07-20 01:10:53', '2026-07-20 01:13:39'),
(7, 'Muhammad Fadhil Putra Alamsyah', 'Fadhil-Designer', 'fadhilputra244@gmail.com', '6282131512151', '$2y$12$vW34ty9UtiEjSynOL5n7d.oJFSK0XpAp07UXJTcPGnTHyecJeKmty', 1, 4, 3, NULL, '{\"theme\":\"dark\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false,\"profile_show_applications\":false}', NULL, 7, NULL, NULL, '2026-07-20 01:11:14', '2026-07-20 01:15:01'),
(8, 'Shaloom Justin Fernando', 'shaloom-designer', 'shalomfernando22@gmail.com', '6289685627727', '$2y$12$LCvLGbTXkLlA47chGu9kxeUhtUgsL.fLzM1BkwtQtY7LOcJtDd1p.', 1, 4, 3, 'core/users/8/avatars/01KXYHMRZV6MAV2B9DS4NKEPQJ.jpg', '{\"theme\":\"light\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":false,\"high_contrast\":false}', NULL, 8, NULL, NULL, '2026-07-20 01:16:27', '2026-07-20 01:18:29'),
(9, 'Muhammad Ilham Fatoni', 'Muhammad-Designer', '19fatonii@gmail.com', '628813276752', '$2y$12$EOrELPuViiEPzyJlIS/ZwuWMM9yRCTH6kzT6EILc4T5YXAH2FUHUu', 1, 4, 3, 'core/users/9/avatars/01KXYHTZ2ASX12Y40DN84B96H8.png', '{\"theme\":\"dark\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":true,\"high_contrast\":true,\"profile_show_applications\":false}', NULL, 9, NULL, NULL, '2026-07-20 01:16:56', '2026-07-20 01:22:26'),
(10, 'Salma Maghfira', 'Salma-Designer', 'elfiraworkspace@gmail.com', '6281231637272', '$2y$12$zxen8Bzn/yr4keJZ.kuoNujqtov.PW.HjEMMe.NY7ftftZsmSGzKO', 1, 4, 3, NULL, '{\"theme\":\"system\",\"language\":\"id\",\"timezone\":\"Asia\\/Bangkok\",\"reduce_motion\":true,\"high_contrast\":false}', NULL, 10, NULL, NULL, '2026-07-20 01:18:18', '2026-07-20 01:21:05'),
(11, 'RIZKY JULIAN PRATAMA', 'rizkyjulian-jete', NULL, '81515495565', '$2y$12$CIUa8yPPiZL1aWmOeHTwk.geo1FDv8UYlUrmQYPlLUaQvodalHuEW', 1, 4, 3, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-20 01:18:21', '2026-07-20 01:19:09'),
(12, 'M. Azis Muhemin Tohari', 'azis-designer', NULL, '82141027799', '$2y$12$iOHWvq3/6wF5v4ornlHdLeYMX/PYHDOMABk38m0M/hw8kNmT9PUG.', 1, 4, 3, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-20 01:23:52', '2026-07-20 01:24:31'),
(13, 'Ganang Syahriar', 'ganang-video creative', NULL, '85606374318', '$2y$12$pXsD17xdckMvZoqPw5nuoe5ea9zAQK9GDQMCXTHkBmlRBjE6qrx96', 1, 4, 4, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-20 01:27:55', '2026-07-20 01:28:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `applications_key_unique` (`key`);

--
-- Indexes for table `application_user`
--
ALTER TABLE `application_user`
  ADD PRIMARY KEY (`application_id`,`user_id`),
  ADD KEY `application_user_user_id_foreign` (`user_id`),
  ADD KEY `application_user_granted_by_foreign` (`granted_by`);

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `app_settings_key_unique` (`key`);

--
-- Indexes for table `asset_links`
--
ALTER TABLE `asset_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `asset_links_linkable_type_linkable_id_index` (`linkable_type`,`linkable_id`),
  ADD KEY `asset_links_updated_by_foreign` (`updated_by`),
  ADD KEY `asset_links_deleted_by_foreign` (`deleted_by`),
  ADD KEY `asset_links_created_by_index` (`created_by`),
  ADD KEY `asset_links_deleted_at_index` (`deleted_at`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversations_context_unique` (`context_type`,`context_id`),
  ADD KEY `conversations_context_status_index` (`context_type`,`status`);

--
-- Indexes for table `conversation_user`
--
ALTER TABLE `conversation_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_user_conversation_id_user_id_unique` (`conversation_id`,`user_id`),
  ADD KEY `conversation_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `creative_report_assessments`
--
ALTER TABLE `creative_report_assessments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `creative_report_assessments_user_id_period_unique` (`user_id`,`period`),
  ADD UNIQUE KEY `creative_report_member_period_unique` (`creative_report_member_id`,`period`),
  ADD KEY `creative_report_assessments_creative_report_group_id_foreign` (`creative_report_group_id`),
  ADD KEY `creative_report_assessments_completed_by_foreign` (`completed_by`),
  ADD KEY `creative_report_period_group_idx` (`period`,`creative_report_group_id`);

--
-- Indexes for table `creative_report_groups`
--
ALTER TABLE `creative_report_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `creative_report_groups_name_unique` (`name`);

--
-- Indexes for table `creative_report_members`
--
ALTER TABLE `creative_report_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `creative_report_members_user_id_unique` (`user_id`),
  ADD KEY `creative_report_members_position_id_foreign` (`position_id`),
  ADD KEY `creative_report_members_reviewed_by_foreign` (`reviewed_by`),
  ADD KEY `creative_report_members_status_position_name_index` (`status`,`position_name`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `divisions_name_unique` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `generator_pricetag_batches`
--
ALTER TABLE `generator_pricetag_batches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pricetag_batches_created_by_foreign` (`created_by`),
  ADD KEY `pricetag_batches_updated_by_foreign` (`updated_by`),
  ADD KEY `pricetag_batches_deleted_by_foreign` (`deleted_by`);

--
-- Indexes for table `generator_pricetag_batch_items`
--
ALTER TABLE `generator_pricetag_batch_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pricetag_batch_items_batch_id_foreign` (`batch_id`),
  ADD KEY `pricetag_batch_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `generator_pricetag_categories`
--
ALTER TABLE `generator_pricetag_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pricetag_categories_created_by_foreign` (`created_by`),
  ADD KEY `pricetag_categories_updated_by_foreign` (`updated_by`),
  ADD KEY `pricetag_categories_deleted_by_foreign` (`deleted_by`);

--
-- Indexes for table `generator_pricetag_products`
--
ALTER TABLE `generator_pricetag_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pricetag_products_name_variant_name_unique` (`name`,`variant_name`),
  ADD KEY `pricetag_products_category_id_foreign` (`category_id`),
  ADD KEY `pricetag_products_created_by_foreign` (`created_by`),
  ADD KEY `pricetag_products_updated_by_foreign` (`updated_by`),
  ADD KEY `pricetag_products_deleted_by_foreign` (`deleted_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kv_retail_tasks`
--
ALTER TABLE `kv_retail_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kv_retail_tasks_legacy_source_id_unique` (`legacy_source`,`legacy_id`),
  ADD KEY `homework_tasks_created_by_foreign` (`created_by`);

--
-- Indexes for table `kv_retail_task_user`
--
ALTER TABLE `kv_retail_task_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homework_task_user_homework_task_id_foreign` (`kv_retail_task_id`),
  ADD KEY `homework_task_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_reply_to_id_foreign` (`reply_to_id`),
  ADD KEY `messages_conversation_created_idx` (`conversation_id`,`created_at`);

--
-- Indexes for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `message_reads_message_id_user_id_unique` (`message_id`,`user_id`),
  ADD KEY `message_reads_user_id_read_at_index` (`user_id`,`read_at`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `odds_categories`
--
ALTER TABLE `odds_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_categories_created_by_foreign` (`created_by`),
  ADD KEY `odds_categories_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `odds_designer_daily_reports`
--
ALTER TABLE `odds_designer_daily_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_daily_report_task_unique` (`report_date`,`task_id`),
  ADD KEY `odds_designer_daily_reports_designer_id_foreign` (`designer_id`),
  ADD KEY `odds_designer_daily_reports_task_id_foreign` (`task_id`),
  ADD KEY `odds_designer_daily_reports_category_id_foreign` (`category_id`);

--
-- Indexes for table `odds_designer_profiles`
--
ALTER TABLE `odds_designer_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_designer_profiles_user_id_unique` (`user_id`),
  ADD KEY `odds_designer_profiles_created_by_foreign` (`created_by`),
  ADD KEY `odds_designer_profiles_updated_by_foreign` (`updated_by`),
  ADD KEY `odds_designer_profiles_status_is_active_index` (`status`,`is_active`);

--
-- Indexes for table `odds_designer_rankings`
--
ALTER TABLE `odds_designer_rankings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_ranking_period_designer_unique` (`period_type`,`period_start`,`designer_id`),
  ADD KEY `odds_designer_rankings_designer_id_foreign` (`designer_id`);

--
-- Indexes for table `odds_system_rules`
--
ALTER TABLE `odds_system_rules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_system_rules_key_unique` (`key`),
  ADD KEY `odds_system_rules_created_by_foreign` (`created_by`),
  ADD KEY `odds_system_rules_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `odds_tasks`
--
ALTER TABLE `odds_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_tasks_task_number_unique` (`task_number`),
  ADD KEY `odds_tasks_category_id_foreign` (`category_id`),
  ADD KEY `odds_tasks_preferred_designer_id_foreign` (`preferred_designer_id`),
  ADD KEY `odds_tasks_assigned_designer_id_foreign` (`assigned_designer_id`),
  ADD KEY `odds_tasks_extra_revision_approved_by_foreign` (`extra_revision_approved_by`),
  ADD KEY `odds_tasks_urgent_revision_approved_by_foreign` (`urgent_revision_approved_by`),
  ADD KEY `odds_tasks_created_by_foreign` (`created_by`),
  ADD KEY `odds_tasks_updated_by_foreign` (`updated_by`),
  ADD KEY `odds_tasks_status_assigned_designer_id_index` (`status`,`assigned_designer_id`),
  ADD KEY `odds_tasks_requester_id_created_at_index` (`requester_id`,`created_at`),
  ADD KEY `odds_tasks_deadline_index` (`deadline`),
  ADD KEY `odds_tasks_current_queue_id_foreign` (`current_queue_id`);

--
-- Indexes for table `odds_task_briefs`
--
ALTER TABLE `odds_task_briefs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_task_briefs_task_id_unique` (`task_id`),
  ADD KEY `odds_task_briefs_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `odds_task_cancel_requests`
--
ALTER TABLE `odds_task_cancel_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_cancel_requests_task_id_foreign` (`task_id`),
  ADD KEY `odds_task_cancel_requests_requested_by_foreign` (`requested_by`),
  ADD KEY `odds_task_cancel_requests_reviewed_by_foreign` (`reviewed_by`);

--
-- Indexes for table `odds_task_queue`
--
ALTER TABLE `odds_task_queue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_queue_task_id_foreign` (`task_id`),
  ADD KEY `odds_task_queue_designer_id_queue_status_priority_score_index` (`designer_id`,`queue_status`,`priority_score`);

--
-- Indexes for table `odds_task_results`
--
ALTER TABLE `odds_task_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `odds_task_results_task_id_version_number_unique` (`task_id`,`version_number`),
  ADD KEY `odds_task_results_submitted_by_foreign` (`submitted_by`);

--
-- Indexes for table `odds_task_reviews`
--
ALTER TABLE `odds_task_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_reviews_task_id_foreign` (`task_id`),
  ADD KEY `odds_task_reviews_result_id_foreign` (`result_id`),
  ADD KEY `odds_task_reviews_reviewer_id_foreign` (`reviewer_id`);

--
-- Indexes for table `odds_task_revisions`
--
ALTER TABLE `odds_task_revisions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_revisions_task_id_foreign` (`task_id`),
  ADD KEY `odds_task_revisions_result_id_foreign` (`result_id`),
  ADD KEY `odds_task_revisions_requested_by_foreign` (`requested_by`),
  ADD KEY `odds_task_revisions_assigned_to_foreign` (`assigned_to`),
  ADD KEY `odds_task_revisions_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `odds_task_skip_requests`
--
ALTER TABLE `odds_task_skip_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_skip_requests_task_id_foreign` (`task_id`),
  ADD KEY `odds_task_skip_requests_designer_id_foreign` (`designer_id`),
  ADD KEY `odds_task_skip_requests_reviewed_by_foreign` (`reviewed_by`);

--
-- Indexes for table `odds_task_time_logs`
--
ALTER TABLE `odds_task_time_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `odds_task_time_logs_designer_id_foreign` (`designer_id`),
  ADD KEY `odds_task_time_logs_task_id_log_type_stopped_at_index` (`task_id`,`log_type`,`stopped_at`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `permission_metadata`
--
ALTER TABLE `permission_metadata`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_metadata_permission_id_unique` (`permission_id`),
  ADD KEY `permission_metadata_application_id_foreign` (`application_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `positions_division_id_foreign` (`division_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `stored_files`
--
ALTER TABLE `stored_files`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stored_files_path_hash_unique` (`path_hash`),
  ADD KEY `stored_files_uploaded_by_foreign` (`uploaded_by`),
  ADD KEY `stored_files_context_idx` (`application_key`,`context_type`,`context_id`),
  ADD KEY `stored_files_application_key_index` (`application_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_created_by_foreign` (`created_by`),
  ADD KEY `users_updated_by_foreign` (`updated_by`),
  ADD KEY `users_deleted_by_foreign` (`deleted_by`),
  ADD KEY `users_name_index` (`name`),
  ADD KEY `users_division_id_foreign` (`division_id`),
  ADD KEY `users_position_id_foreign` (`position_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=269;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `app_settings`
--
ALTER TABLE `app_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `asset_links`
--
ALTER TABLE `asset_links`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `conversation_user`
--
ALTER TABLE `conversation_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `creative_report_assessments`
--
ALTER TABLE `creative_report_assessments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `creative_report_groups`
--
ALTER TABLE `creative_report_groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `creative_report_members`
--
ALTER TABLE `creative_report_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `divisions`
--
ALTER TABLE `divisions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generator_pricetag_batches`
--
ALTER TABLE `generator_pricetag_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generator_pricetag_batch_items`
--
ALTER TABLE `generator_pricetag_batch_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `generator_pricetag_categories`
--
ALTER TABLE `generator_pricetag_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `generator_pricetag_products`
--
ALTER TABLE `generator_pricetag_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kv_retail_tasks`
--
ALTER TABLE `kv_retail_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `kv_retail_task_user`
--
ALTER TABLE `kv_retail_task_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_reads`
--
ALTER TABLE `message_reads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `odds_categories`
--
ALTER TABLE `odds_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `odds_designer_daily_reports`
--
ALTER TABLE `odds_designer_daily_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_designer_profiles`
--
ALTER TABLE `odds_designer_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `odds_designer_rankings`
--
ALTER TABLE `odds_designer_rankings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_system_rules`
--
ALTER TABLE `odds_system_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `odds_tasks`
--
ALTER TABLE `odds_tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `odds_task_briefs`
--
ALTER TABLE `odds_task_briefs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `odds_task_cancel_requests`
--
ALTER TABLE `odds_task_cancel_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_queue`
--
ALTER TABLE `odds_task_queue`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_results`
--
ALTER TABLE `odds_task_results`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_reviews`
--
ALTER TABLE `odds_task_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_revisions`
--
ALTER TABLE `odds_task_revisions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_skip_requests`
--
ALTER TABLE `odds_task_skip_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `odds_task_time_logs`
--
ALTER TABLE `odds_task_time_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `permission_metadata`
--
ALTER TABLE `permission_metadata`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `stored_files`
--
ALTER TABLE `stored_files`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_user`
--
ALTER TABLE `application_user`
  ADD CONSTRAINT `application_user_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_user_granted_by_foreign` FOREIGN KEY (`granted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `application_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `asset_links`
--
ALTER TABLE `asset_links`
  ADD CONSTRAINT `asset_links_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `asset_links_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `asset_links_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `conversation_user`
--
ALTER TABLE `conversation_user`
  ADD CONSTRAINT `conversation_user_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `creative_report_assessments`
--
ALTER TABLE `creative_report_assessments`
  ADD CONSTRAINT `creative_report_assessments_completed_by_foreign` FOREIGN KEY (`completed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creative_report_assessments_creative_report_group_id_foreign` FOREIGN KEY (`creative_report_group_id`) REFERENCES `creative_report_groups` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `creative_report_assessments_creative_report_member_id_foreign` FOREIGN KEY (`creative_report_member_id`) REFERENCES `creative_report_members` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creative_report_assessments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `creative_report_members`
--
ALTER TABLE `creative_report_members`
  ADD CONSTRAINT `creative_report_members_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creative_report_members_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `creative_report_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `generator_pricetag_batches`
--
ALTER TABLE `generator_pricetag_batches`
  ADD CONSTRAINT `pricetag_batches_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `pricetag_batches_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pricetag_batches_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `generator_pricetag_batch_items`
--
ALTER TABLE `generator_pricetag_batch_items`
  ADD CONSTRAINT `pricetag_batch_items_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `generator_pricetag_batches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pricetag_batch_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `generator_pricetag_products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `generator_pricetag_categories`
--
ALTER TABLE `generator_pricetag_categories`
  ADD CONSTRAINT `pricetag_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `pricetag_categories_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pricetag_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `generator_pricetag_products`
--
ALTER TABLE `generator_pricetag_products`
  ADD CONSTRAINT `pricetag_products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `generator_pricetag_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pricetag_products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `pricetag_products_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pricetag_products_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kv_retail_tasks`
--
ALTER TABLE `kv_retail_tasks`
  ADD CONSTRAINT `homework_tasks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kv_retail_task_user`
--
ALTER TABLE `kv_retail_task_user`
  ADD CONSTRAINT `homework_task_user_homework_task_id_foreign` FOREIGN KEY (`kv_retail_task_id`) REFERENCES `kv_retail_tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `homework_task_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_reply_to_id_foreign` FOREIGN KEY (`reply_to_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD CONSTRAINT `message_reads_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_reads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_categories`
--
ALTER TABLE `odds_categories`
  ADD CONSTRAINT `odds_categories_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_categories_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `odds_designer_daily_reports`
--
ALTER TABLE `odds_designer_daily_reports`
  ADD CONSTRAINT `odds_designer_daily_reports_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `odds_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_designer_daily_reports_designer_id_foreign` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_designer_daily_reports_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `odds_designer_profiles`
--
ALTER TABLE `odds_designer_profiles`
  ADD CONSTRAINT `odds_designer_profiles_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_designer_profiles_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_designer_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_designer_rankings`
--
ALTER TABLE `odds_designer_rankings`
  ADD CONSTRAINT `odds_designer_rankings_designer_id_foreign` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `odds_system_rules`
--
ALTER TABLE `odds_system_rules`
  ADD CONSTRAINT `odds_system_rules_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_system_rules_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `odds_tasks`
--
ALTER TABLE `odds_tasks`
  ADD CONSTRAINT `odds_tasks_assigned_designer_id_foreign` FOREIGN KEY (`assigned_designer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `odds_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_current_queue_id_foreign` FOREIGN KEY (`current_queue_id`) REFERENCES `odds_task_queue` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_extra_revision_approved_by_foreign` FOREIGN KEY (`extra_revision_approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_preferred_designer_id_foreign` FOREIGN KEY (`preferred_designer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_tasks_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_tasks_urgent_revision_approved_by_foreign` FOREIGN KEY (`urgent_revision_approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `odds_task_briefs`
--
ALTER TABLE `odds_task_briefs`
  ADD CONSTRAINT `odds_task_briefs_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `odds_task_briefs_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `odds_task_cancel_requests`
--
ALTER TABLE `odds_task_cancel_requests`
  ADD CONSTRAINT `odds_task_cancel_requests_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_cancel_requests_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_cancel_requests_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_queue`
--
ALTER TABLE `odds_task_queue`
  ADD CONSTRAINT `odds_task_queue_designer_id_foreign` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_queue_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_results`
--
ALTER TABLE `odds_task_results`
  ADD CONSTRAINT `odds_task_results_submitted_by_foreign` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_results_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_reviews`
--
ALTER TABLE `odds_task_reviews`
  ADD CONSTRAINT `odds_task_reviews_result_id_foreign` FOREIGN KEY (`result_id`) REFERENCES `odds_task_results` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_reviews_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_reviews_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_revisions`
--
ALTER TABLE `odds_task_revisions`
  ADD CONSTRAINT `odds_task_revisions_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_revisions_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_revisions_requested_by_foreign` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_revisions_result_id_foreign` FOREIGN KEY (`result_id`) REFERENCES `odds_task_results` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_revisions_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_skip_requests`
--
ALTER TABLE `odds_task_skip_requests`
  ADD CONSTRAINT `odds_task_skip_requests_designer_id_foreign` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `odds_task_skip_requests_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_skip_requests_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `odds_task_time_logs`
--
ALTER TABLE `odds_task_time_logs`
  ADD CONSTRAINT `odds_task_time_logs_designer_id_foreign` FOREIGN KEY (`designer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `odds_task_time_logs_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `odds_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permission_metadata`
--
ALTER TABLE `permission_metadata`
  ADD CONSTRAINT `permission_metadata_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `permission_metadata_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `positions_division_id_foreign` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stored_files`
--
ALTER TABLE `stored_files`
  ADD CONSTRAINT `stored_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_division_id_foreign` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
