<?php
/**
 * WP-CLI: wp prolatex import
 *
 * Идемпотентный импорт данных из wp-content/prolatex-data/*.json
 * (смонтировано из /data/*.json проекта через .wp-env.json mappings).
 */

namespace Prolatex\CLI;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once PROLATEX_CORE_DIR . 'includes/class-articles-content.php';

class Import_Command {

	/**
	 * Импортирует матрасы, подушки, тонкие матрасы, отзывы и статьи блога из /data/*.json.
	 *
	 * ## OPTIONS
	 *
	 * [--dry-run]
	 * : Показать, что будет сделано, без записи в базу.
	 *
	 * [--force-content]
	 * : Перезаписать тексты статей блога. По умолчанию контент существующих
	 * : статей не трогается — в нём картинки и правки из админки.
	 *
	 * ## EXAMPLES
	 *
	 *     wp prolatex import
	 *     wp prolatex import --force-content
	 *
	 * @when after_wp_load
	 */
	public function __invoke( $args, $assoc_args ) {
		$dry_run       = isset( $assoc_args['dry-run'] );
		$force_content = isset( $assoc_args['force-content'] );

		if ( ! is_dir( PROLATEX_DATA_DIR ) ) {
			\WP_CLI::error( "Директория с данными не найдена: " . PROLATEX_DATA_DIR . '. Проверьте mappings в .wp-env.json.' );
			return;
		}

		$stats = array(
			'mattress' => 0,
			'pillow'   => 0,
			'topper'   => 0,
			'review'   => 0,
			'post'     => 0,
		);

		$stats['mattress'] = $this->import_mattresses( $dry_run );
		$stats['pillow']   = $this->import_pillows( $dry_run );
		$stats['topper']   = $this->import_toppers( $dry_run );
		$stats['review']   = $this->import_reviews( $dry_run );
		$stats['post']     = $this->import_articles( $dry_run, $force_content );

		\WP_CLI::success(
			sprintf(
				'Импорт завершён. Матрасов: %d, подушек: %d, тонких матрасов: %d, отзывов: %d, статей: %d.',
				$stats['mattress'],
				$stats['pillow'],
				$stats['topper'],
				$stats['review'],
				$stats['post']
			)
		);
	}

	private function read_json( $filename ) {
		$path = PROLATEX_DATA_DIR . '/' . $filename;
		if ( ! file_exists( $path ) ) {
			\WP_CLI::warning( "Файл данных не найден: {$path}" );
			return null;
		}
		$json = file_get_contents( $path );
		$data = json_decode( $json, true );
		if ( JSON_ERROR_NONE !== json_last_error() ) {
			\WP_CLI::warning( "Ошибка парсинга JSON в {$filename}: " . json_last_error_msg() );
			return null;
		}
		return $data;
	}

	/**
	 * Находит существующий пост по slug + post_type (идемпотентность импорта).
	 */
	private function find_existing( $post_type, $slug ) {
		$posts = get_posts(
			array(
				'post_type'      => $post_type,
				'name'           => $slug,
				'post_status'    => 'any',
				'numberposts'    => 1,
				'no_found_rows'  => true,
			)
		);
		return ! empty( $posts ) ? $posts[0] : null;
	}

	private function upsert_post( $post_type, $slug, $postarr, $dry_run ) {
		$existing = $this->find_existing( $post_type, $slug );

		if ( $dry_run ) {
			\WP_CLI::log( sprintf( '[dry-run] %s %s: %s', $existing ? 'обновление' : 'создание', $post_type, $slug ) );
			return $existing ? $existing->ID : 0;
		}

		$postarr['post_type'] = $post_type;
		$postarr['post_name'] = $slug;

		if ( $existing ) {
			$postarr['ID'] = $existing->ID;
			$post_id       = wp_update_post( $postarr, true );
		} else {
			$postarr['post_status'] = $postarr['post_status'] ?? 'publish';
			$post_id                = wp_insert_post( $postarr, true );
		}

		if ( is_wp_error( $post_id ) ) {
			\WP_CLI::warning( sprintf( 'Ошибка сохранения %s (%s): %s', $post_type, $slug, $post_id->get_error_message() ) );
			return 0;
		}

		return $post_id;
	}

	private function firmness_term_slug( $firmness_text ) {
		$map = array(
			'мягкая'                              => 'myagkaya',
			'полумягкая'                           => 'polumyagkaya',
			'средняя'                              => 'srednyaya',
			'комбинированная (средняя/мягкая)'    => 'kombinirovannaya-srednyaya-myagkaya',
		);
		return $map[ $firmness_text ] ?? null;
	}

	/**
	 * Матрасы: data/mattresses.json.
	 */
	private function import_mattresses( $dry_run ) {
		$data = $this->read_json( 'mattresses.json' );
		if ( ! $data || empty( $data['models'] ) ) {
			return 0;
		}

		$common = $data['common'];
		$count  = 0;

		foreach ( $data['models'] as $model ) {
			$content = sprintf(
				"<p>%s</p>\n<p>%s</p>",
				esc_html( $model['summary'] ),
				esc_html( $model['audience'] )
			);

			$post_id = $this->upsert_post(
				'mattress',
				$model['slug'],
				array(
					'post_title'   => $model['name'],
					'post_content' => $content,
					'post_excerpt' => $model['summary'],
					'post_status'  => 'publish',
				),
				$dry_run
			);

			if ( ! $post_id || $dry_run ) {
				$count++;
				continue;
			}

			update_post_meta( $post_id, 'order', (int) $model['order'] );
			update_post_meta( $post_id, 'firmness_label', $model['firmness'] );
			update_post_meta( $post_id, 'firmness_scale', (int) $model['firmness_scale'] );
			update_post_meta( $post_id, 'height_cm', (int) $model['height_cm'] );
			update_post_meta( $post_id, 'layers', array_values( $model['layers'] ) );
			update_post_meta( $post_id, 'latex_total_cm', (int) $model['latex_total_cm'] );
			update_post_meta( $post_id, 'spring_height_cm', (int) ( $model['spring_height_cm'] ?? 0 ) );
			update_post_meta( $post_id, 'topper_cm', (int) ( $model['topper_cm'] ?? 0 ) );
			update_post_meta( $post_id, 'dual_sided', ! empty( $model['dual_sided'] ) );
			update_post_meta( $post_id, 'summary', $model['summary'] );
			update_post_meta( $post_id, 'audience', $model['audience'] );

			update_post_meta( $post_id, 'sizes_widths_cm', array_values( $common['widths_cm'] ) );
			update_post_meta( $post_id, 'sizes_lengths_cm', array_values( $common['lengths_cm'] ) );
			update_post_meta( $post_id, 'max_weight_per_place_kg', (int) $common['max_weight_per_place_kg'] );
			update_post_meta( $post_id, 'price_mode', $common['price_mode'] );
			update_post_meta( $post_id, 'cover', $common['cover'] );
			update_post_meta( $post_id, 'latex_origin', $common['latex_origin'] );
			update_post_meta( $post_id, 'spring_block', $common['spring_block'] );

			// Таксономии.
			wp_set_object_terms( $post_id, $model['category'], 'product_cat', false );
			$firmness_slug = $this->firmness_term_slug( $model['firmness'] );
			if ( $firmness_slug ) {
				wp_set_object_terms( $post_id, $firmness_slug, 'firmness', false );
			}

			\WP_CLI::log( "Матрас: {$model['name']} ({$model['slug']}) -> ID {$post_id}" );
			$count++;
		}

		return $count;
	}

	/**
	 * Подушки: data/pillows.json.
	 */
	private function import_pillows( $dry_run ) {
		$data = $this->read_json( 'pillows.json' );
		if ( ! $data || empty( $data['models'] ) ) {
			return 0;
		}

		$type_labels = array();
		foreach ( $data['types'] as $type ) {
			$type_labels[ $type['slug'] ] = $type;
		}

		$blend_options    = wp_list_pluck( $data['blends'], 'slug' );
		$firmness_options = $data['firmness_options'];

		$count = 0;

		foreach ( $data['models'] as $model ) {
			$slug       = strtolower( $model['model'] );
			$type_info  = $type_labels[ $model['type'] ] ?? null;
			$type_name  = $type_info ? $type_info['name'] : $model['type'];
			$title      = sprintf( '%s (%s)', $model['model'], $type_name );

			$dims  = sprintf( '%d × %d × %d мм', $model['length_mm'], $model['width_mm'], $model['height_mm'] );
			$desc  = $type_info ? $type_info['description'] : '';
			$note  = $model['note'] ?? '';

			$content = sprintf(
				"<p>%s</p>\n<p>Размеры: %s.</p>%s",
				esc_html( $desc ),
				esc_html( $dims ),
				$note ? "\n<p>" . esc_html( $note ) . '</p>' : ''
			);

			$post_id = $this->upsert_post(
				'pillow',
				$slug,
				array(
					'post_title'   => $title,
					'post_content' => $content,
					'post_excerpt' => $desc,
					'post_status'  => 'publish',
				),
				$dry_run
			);

			if ( ! $post_id || $dry_run ) {
				$count++;
				continue;
			}

			update_post_meta( $post_id, 'model_code', $model['model'] );
			update_post_meta( $post_id, 'type', $model['type'] );
			update_post_meta( $post_id, 'length_mm', (int) $model['length_mm'] );
			update_post_meta( $post_id, 'width_mm', (int) $model['width_mm'] );
			update_post_meta( $post_id, 'height_mm', (int) $model['height_mm'] );
			update_post_meta( $post_id, 'note', $note );
			update_post_meta( $post_id, 'blend_options', array_values( $blend_options ) );
			update_post_meta( $post_id, 'firmness_options', array_values( $firmness_options ) );

			$count++;
		}

		\WP_CLI::log( "Подушек обработано: {$count}" );
		return $count;
	}

	/**
	 * Тонкие матрасы: data/toppers.json — одна запись-конфигуратор Pulse Classic.
	 */
	private function import_toppers( $dry_run ) {
		$data = $this->read_json( 'toppers.json' );
		if ( ! $data ) {
			return 0;
		}

		$mattresses_common = $this->read_json( 'mattresses.json' );
		$widths             = $mattresses_common['common']['widths_cm'] ?? array();
		$lengths            = $mattresses_common['common']['lengths_cm'] ?? array();

		$slug    = 'pulse-classic';
		$title   = 'Тонкий матрас Pulse Classic';
		$content = sprintf( '<p>%s</p>', esc_html( $data['intro'] ) );

		$post_id = $this->upsert_post(
			'topper',
			$slug,
			array(
				'post_title'   => $title,
				'post_content' => $content,
				'post_excerpt' => $data['intro'],
				'post_status'  => 'publish',
			),
			$dry_run
		);

		if ( ! $post_id || $dry_run ) {
			return 1;
		}

		update_post_meta( $post_id, 'technology', $data['technology'] );
		update_post_meta( $post_id, 'blend', $data['blend'] );
		update_post_meta( $post_id, 'thickness_mm', array_values( $data['thickness_mm'] ) );
		update_post_meta( $post_id, 'densities_json', wp_json_encode( $data['densities'] ) );
		update_post_meta( $post_id, 'surface_options_json', wp_json_encode( $data['surface_options'] ) );
		update_post_meta( $post_id, 'addons_json', wp_json_encode( $data['addons'] ) );
		update_post_meta( $post_id, 'cut_to_size', ! empty( $data['cut_to_size'] ) );
		update_post_meta( $post_id, 'roll_length_m', (int) $data['roll_length_m'] );
		update_post_meta( $post_id, 'sizes_note', $data['sizes_note'] );
		update_post_meta( $post_id, 'sizes_widths_cm', array_values( $widths ) );
		update_post_meta( $post_id, 'sizes_lengths_cm', array_values( $lengths ) );

		\WP_CLI::log( "Тонкий матрас-конфигуратор: {$title} -> ID {$post_id}" );
		return 1;
	}

	/**
	 * Отзывы: data/content.json -> reviews.
	 */
	private function import_reviews( $dry_run ) {
		$data = $this->read_json( 'content.json' );
		if ( ! $data || empty( $data['reviews'] ) ) {
			return 0;
		}

		$count = 0;
		foreach ( $data['reviews'] as $i => $review ) {
			$slug  = 'review-' . sanitize_title( $review['name'] . '-' . $review['model'] . '-' . ( $i + 1 ) );
			$title = sprintf( '%s (%s) — %s', $review['name'], $review['city'], $review['model'] );

			$post_id = $this->upsert_post(
				'review',
				$slug,
				array(
					'post_title'   => $title,
					'post_content' => '<p>' . esc_html( $review['text'] ) . '</p>',
					'post_status'  => 'publish',
				),
				$dry_run
			);

			if ( ! $post_id || $dry_run ) {
				$count++;
				continue;
			}

			update_post_meta( $post_id, 'author_name', $review['name'] );
			update_post_meta( $post_id, 'city', $review['city'] );
			update_post_meta( $post_id, 'model_name', $review['model'] );
			update_post_meta( $post_id, 'rating', 5 );

			$count++;
		}

		\WP_CLI::log( "Отзывов обработано: {$count}" );
		return $count;
	}

	/**
	 * Статьи блога: обычные posts, полные тексты из Articles_Content.
	 */
	private function import_articles( $dry_run, $force_content = false ) {
		$data = $this->read_json( 'content.json' );
		if ( ! $data || empty( $data['articles'] ) ) {
			return 0;
		}

		$full_articles = \Prolatex\Articles_Content::get_articles();
		$count         = 0;

		foreach ( $data['articles'] as $article ) {
			$slug = $article['slug'];
			if ( ! isset( $full_articles[ $slug ] ) ) {
				\WP_CLI::warning( "Нет сгенерированного текста для статьи: {$slug}" );
				continue;
			}

			$full = $full_articles[ $slug ];

			// Контент существующей статьи — редакторская работа: там картинки,
			// вставленные в админке, которых нет в исходных текстах. Перезапись
			// только по явному --force-content.
			$existing = $this->find_existing( \Prolatex\Articles::CPT, $slug );
			$postarr  = array(
				'post_title'   => $full['title'],
				'post_excerpt' => $full['excerpt'],
				'post_status'  => 'publish',
			);
			if ( ! $existing || $force_content || '' === trim( (string) $existing->post_content ) ) {
				$postarr['post_content'] = $full['content'];
			}

			$post_id = $this->upsert_post(
				\Prolatex\Articles::CPT,
				$slug,
				$postarr,
				$dry_run
			);

			if ( $post_id && ! $dry_run ) {
				// Лид и тег заполняем только у новых статей: у существующих
				// это ручная работа редактора, её перезапись недопустима.
				$lead = get_post_meta( $post_id, \Prolatex\Articles::META_LEAD, true );
				if ( '' === $lead ) {
					update_post_meta( $post_id, \Prolatex\Articles::META_LEAD, $full['excerpt'] );
				}
				if ( ! empty( $full['tag'] ) && ! has_term( '', \Prolatex\Articles::TAX, $post_id ) ) {
					wp_set_object_terms( $post_id, $full['tag'], \Prolatex\Articles::TAX );
				}
				\WP_CLI::log( "Статья: {$full['title']} ({$slug}) -> ID {$post_id}" );
			}

			$count++;
		}

		return $count;
	}
}
