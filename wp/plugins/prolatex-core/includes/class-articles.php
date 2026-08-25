<?php
/**
 * Блог: CPT «Статьи» + таксономия тегов + REST для headless-фронтенда.
 *   GET /wp-json/prolatex/v1/articles           — список статей
 *   GET /wp-json/prolatex/v1/articles/<slug>     — одна статья (с HTML-контентом)
 *
 * Контент статьи редактируется в админке (Gutenberg), отдаётся фронту как HTML.
 * Тег — таксономия article_tag; обложка — миниатюра записи; лид — мета article_lead.
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Articles {

	const CPT      = 'article';
	const TAX      = 'article_tag';
	const META_LEAD = 'article_lead';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_action( 'rest_api_init', array( $this, 'register_meta' ) );
	}

	public function register() {
		register_post_type(
			self::CPT,
			array(
				'labels'              => array(
					'name'          => 'Статьи блога',
					'singular_name' => 'Статья',
					'add_new_item'  => 'Добавить статью',
					'edit_item'     => 'Редактировать статью',
					'menu_name'     => 'Статьи блога',
				),
				'public'              => true,
				'publicly_queryable'  => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_rest'        => true,
				'menu_icon'           => 'dashicons-edit-page',
				'menu_position'       => 25,
				'has_archive'         => false,
				'rewrite'             => array( 'slug' => 'stat', 'with_front' => false ),
				'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions' ),
				'taxonomies'          => array( self::TAX ),
			)
		);

		register_taxonomy(
			self::TAX,
			self::CPT,
			array(
				'labels'            => array(
					'name'          => 'Теги статей',
					'singular_name' => 'Тег',
					'menu_name'     => 'Теги статей',
					'add_new_item'  => 'Добавить тег',
				),
				'public'            => true,
				'hierarchical'      => false,
				'show_ui'           => true,
				'show_in_rest'      => true,
				'show_admin_column' => true,
				'rewrite'           => array( 'slug' => 'stat-tag', 'with_front' => false ),
			)
		);
	}

	public function register_meta() {
		register_post_meta(
			self::CPT,
			self::META_LEAD,
			array(
				'type'         => 'string',
				'description'  => 'Лид-абзац статьи (под заголовком)',
				'single'       => true,
				'show_in_rest' => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function register_routes() {
		register_rest_route(
			'prolatex/v1',
			'/articles',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'serve_list' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'prolatex/v1',
			'/articles/(?P<slug>[^/]+)',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'serve_single' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'slug' => array( 'type' => 'string', 'required' => true ),
				),
			)
		);
	}

	private function first_tag( $post_id ) {
		$terms = get_the_terms( $post_id, self::TAX );
		if ( is_array( $terms ) && ! empty( $terms ) ) {
			return $terms[0]->name;
		}
		return '';
	}

	private function cover_url( $post_id ) {
		$id = get_post_thumbnail_id( $post_id );
		if ( ! $id ) {
			return '';
		}
		$src = wp_get_attachment_image_src( $id, 'large' );
		return $src ? $src[0] : '';
	}

	private function base( $post ) {
		return array(
			'slug'     => urldecode( $post->post_name ),
			'title'    => get_the_title( $post ),
			'excerpt'  => wp_strip_all_tags( get_the_excerpt( $post ) ),
			'lead'     => (string) get_post_meta( $post->ID, self::META_LEAD, true ),
			'tag'      => $this->first_tag( $post->ID ),
			'dateISO'  => get_the_date( 'Y-m-d', $post ),
			'cover'    => $this->cover_url( $post->ID ),
		);
	}

	public function serve_list() {
		$posts = get_posts(
			array(
				'post_type'      => self::CPT,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);
		$out = array();
		foreach ( $posts as $post ) {
			$out[] = $this->base( $post );
		}
		return rest_ensure_response( $out );
	}

	public function serve_single( \WP_REST_Request $req ) {
		$slug  = sanitize_title( $req->get_param( 'slug' ) );
		$posts = get_posts(
			array(
				'post_type'      => self::CPT,
				'post_status'    => 'publish',
				'name'           => $slug,
				'posts_per_page' => 1,
			)
		);
		if ( empty( $posts ) ) {
			return new \WP_Error( 'prolatex_article_not_found', 'Статья не найдена', array( 'status' => 404 ) );
		}
		$post = $posts[0];
		$data = $this->base( $post );
		$data['html'] = apply_filters( 'the_content', $post->post_content );
		return rest_ensure_response( $data );
	}
}
