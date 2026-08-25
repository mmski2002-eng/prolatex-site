<?php
/**
 * Публичные data-эндпоинты для headless-фронтенда:
 *   GET /wp-json/prolatex/v1/mattresses
 *   GET /wp-json/prolatex/v1/pillows
 *   GET /wp-json/prolatex/v1/toppers
 *   GET /wp-json/prolatex/v1/content
 *
 * Контракт формата повторяет /data/*.json (типы фронтенда src/lib/types.ts).
 * База — канонический JSON; поверх накладываются правки из админки
 * (заголовок, summary и мета CPT), чтобы редактирование в WP влияло на сайт.
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Rest_Data {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		// Правка любого товара в админке сбрасывает кеш ответов.
		add_action( 'save_post', array( $this, 'flush_cache' ) );
	}

	public function register_routes() {
		foreach ( array( 'mattresses', 'pillows', 'toppers', 'content' ) as $resource ) {
			register_rest_route(
				'prolatex/v1',
				'/' . $resource,
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'serve_' . $resource ),
					'permission_callback' => '__return_true',
				)
			);
		}
	}

	public function flush_cache() {
		foreach ( array( 'mattresses', 'pillows', 'toppers', 'content' ) as $resource ) {
			delete_transient( 'prolatex_data_' . $resource );
		}
	}

	/**
	 * Читает канонический JSON из смонтированной директории данных.
	 */
	private function read_json( $filename ) {
		$path = trailingslashit( PROLATEX_DATA_DIR ) . $filename;
		if ( ! file_exists( $path ) ) {
			return null;
		}
		$decoded = json_decode( file_get_contents( $path ), true );
		return is_array( $decoded ) ? $decoded : null;
	}

	private function cached( $resource, $builder ) {
		$cached = get_transient( 'prolatex_data_' . $resource );
		if ( false !== $cached ) {
			return rest_ensure_response( $cached );
		}
		$data = call_user_func( $builder );
		if ( null === $data ) {
			return new \WP_Error( 'prolatex_no_data', 'Данные недоступны', array( 'status' => 500 ) );
		}
		set_transient( 'prolatex_data_' . $resource, $data, 5 * MINUTE_IN_SECONDS );
		return rest_ensure_response( $data );
	}

	public function serve_mattresses() {
		return $this->cached( 'mattresses', function () {
			$data = $this->read_json( 'mattresses.json' );
			if ( ! $data ) {
				return null;
			}
			// Оверлей правок из CPT mattress по slug.
			$posts = get_posts(
				array(
					'post_type'      => 'mattress',
					'post_status'    => 'publish',
					'posts_per_page' => -1,
				)
			);
			$by_slug = array();
			foreach ( $posts as $p ) {
				$by_slug[ $p->post_name ] = $p;
			}
			foreach ( $data['models'] as &$model ) {
				if ( ! isset( $by_slug[ $model['slug'] ] ) ) {
					continue;
				}
				$p = $by_slug[ $model['slug'] ];
				// Имя модели: заголовок поста без служебного префикса «Матрас ».
				$title = preg_replace( '/^Матрас\s+/u', '', $p->post_title );
				if ( $title ) {
					$model['name'] = $title;
				}
				foreach ( array( 'summary', 'audience', 'firmness_label', 'firmness_scale', 'height_cm', 'latex_total_cm', 'order' ) as $key ) {
					$val = get_post_meta( $p->ID, $key, true );
					if ( '' === $val || null === $val ) {
						continue;
					}
					$target = ( 'firmness_label' === $key ) ? 'firmness' : $key;
					$model[ $target ] = is_numeric( $val ) && 'summary' !== $key && 'audience' !== $key && 'firmness_label' !== $key
						? (int) $val
						: $val;
				}
				$layers = get_post_meta( $p->ID, 'layers', true );
				if ( is_array( $layers ) && $layers ) {
					$model['layers'] = array_values( $layers );
				}
			}
			unset( $model );
			return $data;
		} );
	}

	public function serve_pillows() {
		return $this->cached( 'pillows', function () {
			return $this->read_json( 'pillows.json' );
		} );
	}

	public function serve_toppers() {
		return $this->cached( 'toppers', function () {
			return $this->read_json( 'toppers.json' );
		} );
	}

	public function serve_content() {
		return $this->cached( 'content', function () {
			return $this->read_json( 'content.json' );
		} );
	}
}
