<?php
/**
 * Plugin Name: ProLatex Core
 * Description: Headless-бэкенд для сайта ProLatex (Про-Латекс): CPT матрасов/подушек/топперов/отзывов/заявок, REST-эндпоинт лидов, безопасность и импорт данных.
 * Version: 1.0.0
 * Author: ProLatex
 * Text Domain: prolatex-core
 *
 * Все данные — исключительно из /data/*.json (единственный источник правды),
 * плагин их не выдумывает, а только раскладывает по CPT/meta для headless-фронтенда.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Прямой доступ запрещён.
}

define( 'PROLATEX_CORE_VERSION', '1.0.0' );
define( 'PROLATEX_CORE_DIR', plugin_dir_path( __FILE__ ) );
define( 'PROLATEX_CORE_URL', plugin_dir_url( __FILE__ ) );
// Путь к каноническим JSON-данным, смонтированным через .wp-env.json mappings
// (wp-content/prolatex-data -> ../data относительно wp/.wp-env.json).
define( 'PROLATEX_DATA_DIR', WP_CONTENT_DIR . '/prolatex-data' );

// Подключаем модули плагина.
require_once PROLATEX_CORE_DIR . 'includes/class-post-types.php';
require_once PROLATEX_CORE_DIR . 'includes/class-meta.php';
require_once PROLATEX_CORE_DIR . 'includes/class-security.php';
require_once PROLATEX_CORE_DIR . 'includes/class-rest-leads.php';
require_once PROLATEX_CORE_DIR . 'includes/class-rest-data.php';
require_once PROLATEX_CORE_DIR . 'includes/class-articles.php';
require_once PROLATEX_CORE_DIR . 'includes/class-lead-settings.php';

/**
 * Инициализация модулей плагина.
 */
function prolatex_core_init() {
	Prolatex\Post_Types::instance();
	Prolatex\Meta::instance();
	Prolatex\Security::instance();
	Prolatex\Rest_Leads::instance();
	Prolatex\Rest_Data::instance();
	Prolatex\Articles::instance();
	Prolatex\Lead_Settings::instance();
}
add_action( 'plugins_loaded', 'prolatex_core_init' );

// WP-CLI: команда импорта данных.
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once PROLATEX_CORE_DIR . 'cli/class-import-command.php';
	WP_CLI::add_command( 'prolatex import', 'Prolatex\\CLI\\Import_Command' );
}

/**
 * Активация плагина: сброс правил перелинковки (rewrite) под новые CPT.
 */
function prolatex_core_activate() {
	Prolatex\Post_Types::instance()->register_post_types();
	Prolatex\Post_Types::instance()->register_taxonomies();
	Prolatex\Articles::instance()->register();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'prolatex_core_activate' );

function prolatex_core_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'prolatex_core_deactivate' );
