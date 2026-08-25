<?php
/**
 * REST-эндпоинт приёма заявок: POST /wp-json/prolatex/v1/leads
 *
 * Защита:
 * - honeypot-поле "website" (боты его заполняют — тихо отвечаем 200, ничего не сохраняя)
 * - rate limit 5 запросов / 10 минут на IP (через transient)
 * - sanitize всех полей + ограничение длины
 * - валидация телефона и email (хотя бы одно из двух обязательно)
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Rest_Leads {

	const NAMESPACE_ = 'prolatex/v1';
	const RATE_LIMIT_MAX     = 5;   // запросов
	const RATE_LIMIT_WINDOW  = 600; // 10 минут в секундах

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route(
			self::NAMESPACE_,
			'/leads',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_lead' ),
				'permission_callback' => '__return_true', // headless-форма, доступна анонимно; защищена honeypot + rate-limit.
				'args'                => array(
					'name'    => array( 'type' => 'string', 'required' => false ),
					'phone'   => array( 'type' => 'string', 'required' => false ),
					'email'   => array( 'type' => 'string', 'required' => false ),
					'message' => array( 'type' => 'string', 'required' => false ),
					'product' => array( 'type' => 'string', 'required' => false ),
					'size'    => array( 'type' => 'string', 'required' => false ),
					'website' => array( 'type' => 'string', 'required' => false ), // honeypot
				),
			)
		);
	}

	public function handle_lead( \WP_REST_Request $request ) {
		$ip = $this->get_client_ip();

		// Honeypot: если скрытое поле заполнено — это бот. Отвечаем "успехом", но ничего не сохраняем.
		$honeypot = trim( (string) $request->get_param( 'website' ) );
		if ( '' !== $honeypot ) {
			return new \WP_REST_Response( array( 'success' => true ), 200 );
		}

		// Rate limit по IP.
		if ( $this->is_rate_limited( $ip ) ) {
			return new \WP_Error(
				'prolatex_rate_limited',
				'Слишком много заявок с вашего IP. Попробуйте позже.',
				array( 'status' => 429 )
			);
		}
		$this->bump_rate_limit( $ip );

		// Санитизация входных данных.
		$name    = sanitize_text_field( (string) $request->get_param( 'name' ) );
		$phone   = sanitize_text_field( (string) $request->get_param( 'phone' ) );
		$email   = sanitize_email( (string) $request->get_param( 'email' ) );
		$message = sanitize_textarea_field( (string) $request->get_param( 'message' ) );
		$product = sanitize_text_field( (string) $request->get_param( 'product' ) );
		$size    = sanitize_text_field( (string) $request->get_param( 'size' ) );

		// Ограничение длины полей (защита от спам-полотен).
		$name    = mb_substr( $name, 0, 100 );
		$phone   = mb_substr( $phone, 0, 30 );
		$message = mb_substr( $message, 0, 2000 );
		$product = mb_substr( $product, 0, 100 );
		$size    = mb_substr( $size, 0, 50 );

		if ( '' === $name ) {
			return new \WP_Error( 'prolatex_invalid_name', 'Укажите имя.', array( 'status' => 400 ) );
		}

		$phone_valid = '' !== $phone && $this->is_valid_phone( $phone );
		$email_valid = '' !== $email && is_email( $email );

		if ( ! $phone_valid && ! $email_valid ) {
			return new \WP_Error(
				'prolatex_invalid_contact',
				'Укажите корректный телефон или email.',
				array( 'status' => 400 )
			);
		}

		if ( '' !== $phone && ! $phone_valid ) {
			return new \WP_Error( 'prolatex_invalid_phone', 'Некорректный формат телефона.', array( 'status' => 400 ) );
		}
		if ( '' !== $email && ! $email_valid ) {
			return new \WP_Error( 'prolatex_invalid_email', 'Некорректный email.', array( 'status' => 400 ) );
		}

		$title = sprintf( 'Заявка: %s — %s', $name, $product ? $product : 'без товара' );

		$post_id = wp_insert_post(
			array(
				'post_type'   => 'lead',
				'post_title'  => $title,
				'post_status' => 'publish', // CPT не публичный, наружу не отдаётся; статус для удобства фильтрации в админке.
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return new \WP_Error( 'prolatex_lead_save_failed', 'Не удалось сохранить заявку.', array( 'status' => 500 ) );
		}

		update_post_meta( $post_id, 'lead_name', $name );
		update_post_meta( $post_id, 'lead_phone', $phone );
		update_post_meta( $post_id, 'lead_email', $email );
		update_post_meta( $post_id, 'lead_message', $message );
		update_post_meta( $post_id, 'lead_product', $product );
		update_post_meta( $post_id, 'lead_size', $size );
		update_post_meta( $post_id, 'lead_ip', $ip );
		update_post_meta( $post_id, 'lead_user_agent', sanitize_text_field( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ) );
		update_post_meta( $post_id, 'lead_created_at', current_time( 'mysql' ) );

		// Уведомление на e-mail получателя заявок.
		$to = Lead_Settings::get_email();
		if ( $to && is_email( $to ) ) {
			$lines = array(
				'Новая заявка с сайта Про-Латекс',
				'',
				'Имя: ' . $name,
				'Телефон: ' . $phone,
				'E-mail: ' . ( $email ? $email : '—' ),
				'Товар: ' . ( $product ? $product : '—' ),
				'Размер: ' . ( $size ? $size : '—' ),
				'Сообщение: ' . ( $message ? $message : '—' ),
				'IP: ' . $ip,
				'Время: ' . current_time( 'mysql' ),
			);
			$subject = 'Заявка с сайта: ' . $name . ( $product ? ' — ' . $product : '' );
			wp_mail( $to, $subject, implode( "\n", $lines ) );
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'id'      => $post_id,
			),
			200
		);
	}

	/**
	 * Простая проверка телефона: 10-15 цифр, допускаются +()-. пробелы.
	 */
	private function is_valid_phone( $phone ) {
		$digits = preg_replace( '/\D+/', '', $phone );
		return preg_match( '/^\d{10,15}$/', $digits ) === 1;
	}

	private function get_client_ip() {
		foreach ( array( 'HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR' ) as $key ) {
			if ( ! empty( $_SERVER[ $key ] ) ) {
				$value = $_SERVER[ $key ];
				if ( 'HTTP_X_FORWARDED_FOR' === $key ) {
					$parts = explode( ',', $value );
					$value = trim( $parts[0] );
				}
				return sanitize_text_field( $value );
			}
		}
		return '0.0.0.0';
	}

	private function rate_limit_key( $ip ) {
		return 'prolatex_lead_rl_' . md5( $ip );
	}

	private function is_rate_limited( $ip ) {
		$count = (int) get_transient( $this->rate_limit_key( $ip ) );
		return $count >= self::RATE_LIMIT_MAX;
	}

	private function bump_rate_limit( $ip ) {
		$key   = $this->rate_limit_key( $ip );
		$count = (int) get_transient( $key );
		if ( 0 === $count ) {
			set_transient( $key, 1, self::RATE_LIMIT_WINDOW );
		} else {
			// Продлеваем окно от последнего запроса (скользящее окно из максимум WINDOW сек).
			set_transient( $key, $count + 1, self::RATE_LIMIT_WINDOW );
		}
	}
}
