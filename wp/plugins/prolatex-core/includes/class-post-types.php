<?php
/**
 * Регистрация Custom Post Types и таксономий для ProLatex.
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Post_Types {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ), 5 );
	}

	/**
	 * CPT: mattress, pillow, topper, review, lead.
	 */
	public function register_post_types() {

		// Матрасы.
		register_post_type(
			'mattress',
			array(
				'labels'             => $this->labels( 'Матрас', 'Матрасы' ),
				'public'              => true,
				'has_archive'         => 'matrasy',
				'rewrite'             => array( 'slug' => 'matrasy', 'with_front' => false ),
				'show_in_rest'        => true,
				'rest_base'           => 'mattress',
				'menu_icon'           => 'dashicons-slides',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
				'show_in_menu'        => true,
				'menu_position'       => 23,
			)
		);

		// Подушки.
		register_post_type(
			'pillow',
			array(
				'labels'             => $this->labels( 'Подушка', 'Подушки' ),
				'public'              => true,
				'has_archive'         => 'podushki',
				'rewrite'             => array( 'slug' => 'podushki', 'with_front' => false ),
				'show_in_rest'        => true,
				'rest_base'           => 'pillow',
				'menu_icon'           => 'dashicons-heart',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
				'show_in_menu'        => true,
				'menu_position'       => 24,
			)
		);

		// Топперы.
		register_post_type(
			'topper',
			array(
				'labels'             => $this->labels( 'Топпер', 'Топперы' ),
				'public'              => true,
				'has_archive'         => 'toppery',
				'rewrite'             => array( 'slug' => 'toppery', 'with_front' => false ),
				'show_in_rest'        => true,
				'rest_base'           => 'topper',
				'menu_icon'           => 'dashicons-layout',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
				'show_in_menu'        => true,
				'menu_position'       => 26,
			)
		);

		// Отзывы.
		register_post_type(
			'review',
			array(
				'labels'             => $this->labels( 'Отзыв', 'Отзывы' ),
				'public'              => true,
				'has_archive'         => false,
				'publicly_queryable' => true,
				'rewrite'             => array( 'slug' => 'review', 'with_front' => false ),
				'show_in_rest'        => true,
				'rest_base'           => 'review',
				'menu_icon'           => 'dashicons-star-filled',
				'supports'            => array( 'title', 'editor', 'custom-fields' ),
				'show_in_menu'        => true,
				'menu_position'       => 27,
			)
		);

		// Заявки (лиды) — НЕ публичный CPT, но с админ-UI и без REST-выдачи наружу.
		register_post_type(
			'lead',
			array(
				'labels'              => $this->labels( 'Заявка', 'Заявки' ),
				'public'              => false,
				'publicly_queryable'  => false,
				'exclude_from_search' => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => false, // приём заявок идёт через кастомный REST-контроллер, не через wp/v2.
				'has_archive'         => false,
				'menu_icon'           => 'dashicons-email-alt',
				'supports'            => array( 'title', 'custom-fields' ),
				'capability_type'     => 'post',
				'map_meta_cap'        => true,
				'menu_position'       => 22,
			)
		);
	}

	/**
	 * Таксономии: product_cat (категория матраса), firmness (жёсткость).
	 */
	public function register_taxonomies() {

		register_taxonomy(
			'product_cat',
			array( 'mattress' ),
			array(
				'labels'            => $this->labels( 'Категория', 'Категории', true ),
				'hierarchical'      => true,
				'public'            => true,
				'show_in_rest'      => true,
				'rest_base'         => 'product_cat',
				'rewrite'           => array( 'slug' => 'matrasy', 'with_front' => false ),
			)
		);

		register_taxonomy(
			'firmness',
			array( 'mattress', 'pillow' ),
			array(
				'labels'            => $this->labels( 'Жёсткость', 'Жёсткости', true ),
				'hierarchical'      => false,
				'public'            => true,
				'show_in_rest'      => true,
				'rest_base'         => 'firmness',
				'rewrite'           => array( 'slug' => 'zhestkost', 'with_front' => false ),
			)
		);

		// Термины product_cat строго из data/mattresses.json -> common.categories.
		$this->maybe_create_terms(
			'product_cat',
			array(
				'pruzhinnye'    => 'Пружинные',
				'bespruzhinnye' => 'Беспружинные',
				's-topperom'    => 'С топпером',
			)
		);

		// Термины firmness — по значениям firmness из data/mattresses.json + pillows.json.
		$this->maybe_create_terms(
			'firmness',
			array(
				'myagkaya'                        => 'мягкая',
				'polumyagkaya'                     => 'полумягкая',
				'srednyaya'                        => 'средняя',
				'kombinirovannaya-srednyaya-myagkaya' => 'комбинированная (средняя/мягкая)',
			)
		);
	}

	private function maybe_create_terms( $taxonomy, $slug_name_map ) {
		foreach ( $slug_name_map as $slug => $name ) {
			if ( ! term_exists( $slug, $taxonomy ) ) {
				wp_insert_term( $name, $taxonomy, array( 'slug' => $slug ) );
			}
		}
	}

	private function labels( $singular, $plural, $taxonomy = false ) {
		return array(
			'name'          => $plural,
			'singular_name' => $singular,
			'add_new_item'  => 'Добавить: ' . $singular,
			'edit_item'     => 'Редактировать: ' . $singular,
			'new_item'      => 'Новый(ая): ' . $singular,
			'view_item'     => 'Просмотр: ' . $singular,
			'search_items'  => 'Искать: ' . $plural,
			'not_found'     => 'Не найдено',
			'menu_name'     => $plural,
			'all_items'     => 'Все: ' . $plural,
		);
	}
}
