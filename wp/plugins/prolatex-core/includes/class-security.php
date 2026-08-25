<?php
/**
 * Хардening WordPress под headless-режим:
 * - отключение XML-RPC и pingback
 * - скрытие версии WP (generator)
 * - блокировка перечисления пользователей через REST (/wp/v2/users -> 401 для анонимов)
 * - security-заголовки
 * - отключение комментариев глобально
 *
 * DISALLOW_FILE_EDIT задаётся в .wp-env.json (config), здесь не дублируется.
 */

namespace Prolatex;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Security {

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		$this->disable_xmlrpc();
		$this->hide_generator();
		$this->block_user_enumeration();
		$this->security_headers();
		$this->disable_comments();
	}

	/**
	 * XML-RPC: полностью отключаем и жёстко режем прямые запросы к xmlrpc.php (403).
	 */
	private function disable_xmlrpc() {
		add_filter( 'xmlrpc_enabled', '__return_false' );

		// Убираем pingback из методов на всякий случай (даже если xmlrpc_enabled фильтр обойдут).
		add_filter(
			'xmlrpc_methods',
			function ( $methods ) {
				unset( $methods['pingback.ping'], $methods['pingback.extensions.getPingbacks'] );
				return array();
			}
		);

		// Убираем X-Pingback заголовок и pingback-ссылку из <head>.
		add_filter(
			'wp_headers',
			function ( $headers ) {
				unset( $headers['X-Pingback'] );
				return $headers;
			}
		);
		remove_action( 'wp_head', 'rsd_link' );

		// Жёсткая блокировка прямого обращения к xmlrpc.php.
		add_action(
			'init',
			function () {
				if ( isset( $_SERVER['SCRIPT_NAME'] ) && false !== strpos( $_SERVER['SCRIPT_NAME'], 'xmlrpc.php' ) ) {
					status_header( 403 );
					header( 'Content-Type: text/plain; charset=utf-8' );
					die( 'XML-RPC disabled.' );
				}
			},
			1
		);
	}

	/**
	 * Скрываем версию WordPress (meta generator, RSS, статика с ?ver=).
	 */
	private function hide_generator() {
		remove_action( 'wp_head', 'wp_generator' );
		add_filter( 'the_generator', '__return_empty_string' );

		add_filter(
			'style_loader_src',
			array( $this, 'strip_version_query_arg' ),
			9999
		);
		add_filter(
			'script_loader_src',
			array( $this, 'strip_version_query_arg' ),
			9999
		);
	}

	public function strip_version_query_arg( $src ) {
		if ( strpos( $src, 'ver=' . get_bloginfo( 'version' ) ) !== false ) {
			$src = remove_query_arg( 'ver', $src );
		}
		return $src;
	}

	/**
	 * /wp-json/wp/v2/users и /wp-json/wp/v2/users/<id> -> 401 для неавторизованных запросов.
	 */
	private function block_user_enumeration() {
		add_filter(
			'rest_pre_dispatch',
			function ( $result, $server, $request ) {
				$route = $request->get_route();
				if ( 0 === strpos( $route, '/wp/v2/users' ) && ! is_user_logged_in() ) {
					return new \WP_Error(
						'rest_forbidden',
						__( 'Доступ к списку пользователей запрещён.', 'prolatex-core' ),
						array( 'status' => 401 )
					);
				}
				return $result;
			},
			10,
			3
		);

		// Дополнительно скрываем автора в REST-ответах постов от неавторизованных (email/логин и так не отдаются ядром, но подчищаем author name paths при необходимости).
	}

	/**
	 * Security-заголовки на все ответы (фронт, админка, REST).
	 */
	private function security_headers() {
		$send = function () {
			if ( headers_sent() ) {
				return;
			}
			header( 'X-Content-Type-Options: nosniff' );
			header( 'X-Frame-Options: SAMEORIGIN' );
			header( 'Referrer-Policy: strict-origin-when-cross-origin' );
		};

		add_action( 'send_headers', $send );
		add_action( 'rest_api_init', $send, 0 );
	}

	/**
	 * Полное отключение комментариев (сайт-каталог без блога-комментирования).
	 */
	private function disable_comments() {
		// Закрыть поддержку комментариев/трекбеков у всех типов записей.
		add_action(
			'init',
			function () {
				$types = get_post_types( array( 'public' => true ) );
				foreach ( $types as $type ) {
					if ( post_type_supports( $type, 'comments' ) ) {
						remove_post_type_support( $type, 'comments' );
						remove_post_type_support( $type, 'trackbacks' );
					}
				}
			},
			100
		);

		// Закрыть возможность оставлять комментарии.
		add_filter( 'comments_open', '__return_false', 20, 2 );
		add_filter( 'pings_open', '__return_false', 20, 2 );

		// Скрыть существующие комментарии.
		add_filter( 'comments_array', '__return_empty_array', 10, 2 );

		// Убрать пункт меню "Комментарии" из админки.
		add_action(
			'admin_menu',
			function () {
				remove_menu_page( 'edit-comments.php' );
			}
		);

		// Убрать комментарии из панели "На виду" / admin bar.
		add_action(
			'init',
			function () {
				if ( is_admin_bar_showing() ) {
					remove_action( 'admin_bar_menu', 'wp_admin_bar_comments_menu', 60 );
				}
			}
		);

		// Отключить REST-маршрут comments для анонимов (создание/чтение не нужно headless-фронту).
		add_filter(
			'rest_endpoints',
			function ( $endpoints ) {
				foreach ( $endpoints as $route => $handlers ) {
					if ( 0 === strpos( $route, '/wp/v2/comments' ) ) {
						unset( $endpoints[ $route ] );
					}
				}
				return $endpoints;
			}
		);
	}
}
