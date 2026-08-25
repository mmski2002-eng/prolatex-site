<?php
/**
 * Регистрация post meta (show_in_rest) для всех CPT — поля строго повторяют
 * модели данных из data/mattresses.json, pillows.json, toppers.json.
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Meta {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'init', array( $this, 'register_all' ), 10 );
	}

	public function register_all() {
		$this->register_mattress_meta();
		$this->register_pillow_meta();
		$this->register_topper_meta();
		$this->register_review_meta();
		$this->register_lead_meta();
	}

	/**
	 * Универсальный auth_callback: редактировать meta может тот, кто может редактировать пост.
	 */
	private function editor_auth() {
		return function () {
			return current_user_can( 'edit_posts' );
		};
	}

	private function string_field( $post_type, $key, $description = '' ) {
		register_post_meta(
			$post_type,
			$key,
			array(
				'type'          => 'string',
				'single'        => true,
				'default'       => '',
				'description'   => $description,
				'show_in_rest'  => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback' => $this->editor_auth(),
			)
		);
	}

	private function integer_field( $post_type, $key, $description = '' ) {
		register_post_meta(
			$post_type,
			$key,
			array(
				'type'          => 'integer',
				'single'        => true,
				'default'       => 0,
				'description'   => $description,
				'show_in_rest'  => true,
				'auth_callback' => $this->editor_auth(),
			)
		);
	}

	private function boolean_field( $post_type, $key, $description = '' ) {
		register_post_meta(
			$post_type,
			$key,
			array(
				'type'          => 'boolean',
				'single'        => true,
				'default'       => false,
				'description'   => $description,
				'show_in_rest'  => true,
				'auth_callback' => $this->editor_auth(),
			)
		);
	}

	private function string_array_field( $post_type, $key, $description = '' ) {
		register_post_meta(
			$post_type,
			$key,
			array(
				'type'         => 'array',
				'single'       => true,
				'description'  => $description,
				'show_in_rest' => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array( 'type' => 'string' ),
					),
				),
				'auth_callback' => $this->editor_auth(),
			)
		);
	}

	private function integer_array_field( $post_type, $key, $description = '' ) {
		register_post_meta(
			$post_type,
			$key,
			array(
				'type'         => 'array',
				'single'       => true,
				'description'  => $description,
				'show_in_rest' => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array( 'type' => 'integer' ),
					),
				),
				'auth_callback' => $this->editor_auth(),
			)
		);
	}

	/**
	 * Матрасы (mattresses.json): модели + common-параметры (продублированы в каждый пост
	 * для самодостаточности REST-ответа на фронтенде).
	 */
	private function register_mattress_meta() {
		$pt = 'mattress';

		$this->integer_field( $pt, 'order', 'Порядок сортировки модели' );
		$this->string_field( $pt, 'firmness_label', 'Текстовая жёсткость (дублирует таксономию firmness)' );
		$this->integer_field( $pt, 'firmness_scale', 'Шкала жёсткости 1-5' );
		$this->integer_field( $pt, 'height_cm', 'Общая высота матраса, см' );
		$this->string_array_field( $pt, 'layers', 'Слои матраса сверху вниз' );
		$this->integer_field( $pt, 'latex_total_cm', 'Суммарная толщина латекса, см' );
		$this->integer_field( $pt, 'spring_height_cm', 'Высота пружинного блока, см (0 — беспружинный)' );
		$this->integer_field( $pt, 'topper_cm', 'Толщина интегрированного топпера, см (0 — без топпера)' );
		$this->boolean_field( $pt, 'dual_sided', 'Двусторонняя разная жёсткость' );
		$this->string_field( $pt, 'summary', 'Короткое описание модели' );
		$this->string_field( $pt, 'audience', 'Кому подходит модель' );

		// Общие параметры (common) — дублируются на каждую модель.
		$this->integer_array_field( $pt, 'sizes_widths_cm', 'Доступные ширины, см' );
		$this->integer_array_field( $pt, 'sizes_lengths_cm', 'Доступные длины, см' );
		$this->integer_field( $pt, 'max_weight_per_place_kg', 'Максимальная нагрузка на спальное место, кг' );
		$this->string_field( $pt, 'price_mode', 'Режим цены (on_request)' );
		$this->string_field( $pt, 'cover', 'Описание чехла' );
		$this->string_field( $pt, 'latex_origin', 'Происхождение латекса' );
		$this->string_field( $pt, 'spring_block', 'Описание пружинного блока' );
	}

	/**
	 * Подушки (pillows.json).
	 */
	private function register_pillow_meta() {
		$pt = 'pillow';

		$this->string_field( $pt, 'model_code', 'Код модели (например K108)' );
		$this->string_field( $pt, 'type', 'Тип: soap / ergo / ergo-premium' );
		$this->integer_field( $pt, 'length_mm', 'Длина, мм' );
		$this->integer_field( $pt, 'width_mm', 'Ширина, мм' );
		$this->integer_field( $pt, 'height_mm', 'Высота, мм' );
		$this->string_field( $pt, 'note', 'Примечание к модели' );
		$this->string_array_field( $pt, 'blend_options', 'Доступные составы: classic, natural' );
		$this->string_array_field( $pt, 'firmness_options', 'Доступные жёсткости' );
	}

	/**
	 * Топперы (toppers.json) — запись-конфигуратор Pulse Classic.
	 */
	private function register_topper_meta() {
		$pt = 'topper';

		$this->string_field( $pt, 'technology', 'Технология вулканизации (Pulse)' );
		$this->string_field( $pt, 'blend', 'Состав латекса' );
		$this->integer_array_field( $pt, 'thickness_mm', 'Доступные толщины, мм' );
		$this->string_field( $pt, 'densities_json', 'Плотности (JSON-массив объектов kg_m3/feel/name)' );
		$this->string_field( $pt, 'surface_options_json', 'Варианты поверхности (JSON-массив)' );
		$this->string_field( $pt, 'addons_json', 'Дополнительные опции, напр. GelPulse (JSON-массив)' );
		$this->boolean_field( $pt, 'cut_to_size', 'Раскрой в размер' );
		$this->integer_field( $pt, 'roll_length_m', 'Длина рулона, м' );
		$this->string_field( $pt, 'sizes_note', 'Примечание по размерам' );
		$this->integer_array_field( $pt, 'sizes_widths_cm', 'Стандартные ширины, см' );
		$this->integer_array_field( $pt, 'sizes_lengths_cm', 'Стандартные длины, см' );
	}

	/**
	 * Отзывы (content.json -> reviews).
	 */
	private function register_review_meta() {
		$pt = 'review';

		$this->string_field( $pt, 'author_name', 'Имя автора отзыва' );
		$this->string_field( $pt, 'city', 'Город автора' );
		$this->string_field( $pt, 'model_name', 'Модель, о которой отзыв' );
		$this->integer_field( $pt, 'rating', 'Оценка 1-5' );
	}

	/**
	 * Заявки (lead) — meta заполняется REST-контроллером, наружу не отдаётся (show_in_rest=false у CPT).
	 */
	private function register_lead_meta() {
		$pt = 'lead';

		$fields = array( 'lead_name', 'lead_phone', 'lead_email', 'lead_message', 'lead_product', 'lead_size', 'lead_ip', 'lead_user_agent', 'lead_created_at' );
		foreach ( $fields as $field ) {
			register_post_meta(
				$pt,
				$field,
				array(
					'type'          => 'string',
					'single'        => true,
					'show_in_rest'  => false,
					'auth_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}
}
